//ComponentBox class that holds one displayed box
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});


class ComponentBox extends React.Component {
	constructor(props) {
		super(props);
	}

	renderSection(section) {
		const {classes} = this.props;

		let content = [];
		section.assignments.map((components, idx) => {
			let sectionContent = [];

			components.map((uuid, idx) => {
				let info = this.props.getComponentInfo(uuid);
				sectionContent.push(	
					<Paper className={classes.paper}>{info}</Paper>
				)
			})

			content.push(
				<Grid item xs={10/section.assignments.length}>
					{sectionContent}
				</Grid>
			)
		})

		return (
			<Grid container spacing={Math.ceil(2/section.assignments[0].length)}>
				{content}
			</Grid>
		)
	}

	renderSections(sections) {
		let content = [];
		sections.map((section, idx) => {
			content.push(
				<div>
					<h3> Section {idx+1} ({section.type}) </h3>
					{this.renderSection(section)}
				</div>
			);
		})

		return content;
	}

	render() {
		const {classes} = this.props;
		let box = this.props.box;
		return (
			<div className={classes.root}>
				<h2> {box.title} </h2>
				<h4> {box.description} </h4>
				{this.renderSections(box.sections)}
			</div>
		)
	}
}

ComponentBox.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ComponentBox);