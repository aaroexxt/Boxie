//ComponentBox class that holds one displayed box
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import ReactGridLayout from 'react-grid-layout';
import Paper from '@material-ui/core/Paper';
import WarningIcon from '@material-ui/icons/Warning';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

import {componentDefinitions as cDefs} from "./utils/componentDefinitions.js"
import ComponentInfo from "./ComponentInfo.jsx"
import mutateState from './mutateState.jsx'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center'
  },
  dimWarn: {
  	padding: theme.spacing(1),
  	textAlign: 'center',
  	color: 'black',
  	backgroundColor: '#FFFF99'
  },
  flexCenter: {
  	display: 'flex',
  	alignItems: 'center'
  },
  popover: {
  	pointerEvents: "none"
  },
  clickThrough: {
  	pointerEvents: "all"
  }
});



class StorageBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			layouts: [],
			illegalDimension: false,
			componentPopup: false,
			componentPopupRef: null,
			quantityOverlay: true
		}

		this.state.layouts = this.boxToLayouts(this.props.box);
	}

	handleLayoutChange(layout, idx) {
		let illegalSection = false;
		//Loop through all layouts and make sure none are illegal
		for (let i=0; i<this.state.layouts.length; i++) {
			let layoutToTest = (i == idx) ? layout : this.state.layouts[i]; //if we're testing the current section, use the "updated" layout

			let maxX = -100;
			let maxY = -100;
			for (let i=0; i<layoutToTest.length; i++) {
				if (layoutToTest[i].x > maxX) maxX = layoutToTest[i].x;
				if (layoutToTest[i].y > maxY) maxY = layoutToTest[i].y;
			}

			let section = this.props.box.sections[i];
			if (maxY+1 > section.height || maxX+1 > section.width) {
				//console.log("Illegal section at idx "+i);
				illegalSection = true;
				break;
			}
		}

		this.state.layouts[idx] = layout; //Set the layout
		if (illegalSection) {
			mutateState(this, {illegalDimension: true})
		} else {
			mutateState(this, {illegalDimension: false})
			this.props.handleBoxChange(this.layoutsToBox(layout, idx, this.props.box)); //Actually fire box save event
		}
	}

	boxToLayouts(box) {
		let sections = box.sections;
		let layouts = [];
		sections.map((section, idx) => {
			layouts[idx] = new Array();
			let layout = layouts[idx];

			section.assignments.map((components, idxS) => {
				components.map((uuid, idxC) => {
					layout.push({
						i: uuid,
						x: idxC,
						y: idxS,
						w: 1,
						h: 1,
						isBounded: true,
						isResizable: false
					})
				})
			})
		})

		return layouts;
	}

	layoutsToBox(layout, sectionIdx, box) {
		let bAssign = [];

		let maxX = -100;
		let maxY = -100;
		for (let i=0; i<layout.length; i++) {
			if (layout[i].x > maxX) maxX = layout[i].x;
			if (layout[i].y > maxY) maxY = layout[i].y;
		}

		for (let i=0; i<maxY+1; i++) {
			let arr = [];
			for (let j=0; j<maxX+1; j++) arr.push("");
			bAssign.push(arr);
		}

		layout.map((item, idx) => { //items in the new layout
			bAssign[item.y][item.x] = item.i;
		})

		box.sections[sectionIdx].assignments = JSON.parse(JSON.stringify(bAssign));

		return box;
	}

	handleComponentHover(uuid) {
		if (uuid == null || typeof uuid == "undefined") {
			mutateState(this, {componentPopup: false})
		} else {
			let component = this.props.getComponent(uuid);
			this.state.componentPopupRef = component;
			mutateState(this, {componentPopup: true});
		}
	}

	renderSections(sections) {
		const {classes} = this.props;

		let content = [];
		sections.map((section, idx) => {
			let sContent = [];

			section.assignments.map((components, idxS) => {
				components.map((uuid, idxC) => {

					let component = this.props.getComponent(uuid);
					let info;
					switch(component.type) {
						case cDefs.types.RESISTOR:
						case cDefs.types.CAPACITOR:
							info = component.additional.value+component.additional.valueUnit;
							break;
						case cDefs.types.IC:
						case cDefs.types.OTHER:
							info = component.additional.identifier;
							break;
						case cDefs.types.CRYSTAL:
							info = component.additional.frequency+component.additional.frequencyUnit;
							break;
						case cDefs.types.LED:
							info = component.additional.color;
							break;
						default:
							info = "*";
							break;
					}

					let styleQuantity = {backgroundColor: ""}
					let q = component.quantity;
					if (this.state.quantityOverlay) {
						if (q < 0) { //purple
							styleQuantity.backgroundColor = "#df80ed";
						} else if (q < 5) { //red
							styleQuantity.backgroundColor = "#de665d";
						} else if (q < 20) { //orange
							styleQuantity.backgroundColor = "#e8cf6b";
						} else if (q < 50) { //green
							styleQuantity.backgroundColor = "#86e86d";
						} else { //blue
							styleQuantity.backgroundColor = "#7893de";
						}
					}

					sContent.push(
						<div key={uuid} className={classes.paper}>
							<Paper
								onMouseEnter={() => {this.handleComponentHover(uuid)}}
								onMouseLeave={() => {this.handleComponentHover(null)}}
								className={classes.paper}
								style={styleQuantity}
								variant="outlined"
							>{info}</Paper>
						</div>
					)
				})
			})

			content.push(
				<div key={idx}>
					<h3> Section {idx+1} ({section.type}) </h3>
					<ReactGridLayout
						className="layout"
						layout={this.state.layouts[idx]}
						cols={section.width}
						rowHeight={30}
						width={1100}
						onLayoutChange={(layout) => {
							this.handleLayoutChange(layout, idx)
						}}
					>
						{sContent}
					</ReactGridLayout>
				</div>
			);
		})

		return content;
	}

	handleRestoreButton() {
		this.setState({illegalDimension: false, layouts: this.boxToLayouts(this.props.box)})
	}

	toggleQuantityOverlay() {
		mutateState(this, {quantityOverlay: !this.state.quantityOverlay})
	}

	render() {
		const {classes} = this.props;
		let box = this.props.box;
	
		return (
			<div>
				<h2> {box.title} </h2>
				<h4> {box.description} </h4>
				<Button variant="outlined" onClick={() => {this.toggleQuantityOverlay()}}> Toggle Quantity Overlay </Button>
				{this.renderSections(box.sections)}

				<Popover 
				  anchorReference="anchorPosition"
				  anchorPosition={{ top: 100, left: 200 }}
				  anchorOrigin={{
				    vertical: 'top',
				    horizontal: 'left',
				  }}
				  transformOrigin={{
				    vertical: 'top',
				    horizontal: 'left',
				  }}
				  open={this.state.illegalDimension}
				  className={classes.popover}
				>
					<Paper className={classes.dimWarn}>
						<div className={classes.flexCenter}>
							<WarningIcon /> &nbsp; Warning: Box has an invalid dimension. Changes will not be saved.
						</div>
						<br />
						<Button
							variant="outlined"
							className={classes.clickThrough}
							onClick={() => {this.handleRestoreButton()}}
						> Restore Last Saved Version
						</Button>
					</Paper>
				</Popover>

				<Popover 
				  anchorReference="anchorPosition"
				  anchorPosition={{ top: 100, left: 1000 }}
				  anchorOrigin={{
				    vertical: 'top',
				    horizontal: 'left',
				  }}
				  transformOrigin={{
				    vertical: 'top',
				    horizontal: 'left',
				  }}
				  open={this.state.componentPopup}
				  className={classes.popover}
				>
					<ComponentInfo component={this.state.componentPopupRef} />
				</Popover>
			</div>
		)
	}
}

StorageBox.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(StorageBox);