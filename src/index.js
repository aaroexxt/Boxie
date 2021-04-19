//Basic react deps
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Addtl nodejs libs
import { saveAs } from 'file-saver';

//Specific components
import ComponentBox from './componentBox.jsx'
import DatabaseLS from "./databaseLS.jsx"
import NavHeader from './NavHeader.jsx'

//Util functions
import mutateState from './mutateState.jsx'
import {componentLookup, getSpaceInBox} from "./utils/lookup.js";
import {componentDefinitions as cDefs} from "./utils/componentDefinitions.js"

import storage from './storageTemp.jsx';


class Boxie extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			store: {
				boxes: [],
				components: [],
				componentTotal: 0,
				boxTotal: 0
			},
			menu: {
				options: [
					["Load/Store DB", true], //name, disabled
					["Display Boxes", false],
					["Add", false],
					["Delete", false],
					["Save Data", false],
					["Lookup", false],
					["Export Labels", false],
					["BOM Management", false]
				],
				selected: 0
			},
			databaseStarted: false
		}

		setTimeout(() => {
			this.handleStorageUpload(JSON.stringify(storage));
		}, 200);
	}

	handleMenuChange = (event, idx) => {
		if (idx == this.state.menu.selected) return; //make sure it's diff than what we have
		
		switch(idx) {
			case this.nameToMenuIdx("Local Box"): //load box
				console.log("LoadBox selected original")
				break;
			case this.nameToMenuIdx("Add"):
				console.log("Add selected")
				break;
		}

		//Check that it's valid
		if (this.menuIdxToName(idx)) { //will return false if its not
			mutateState(this, {
				menu: {selected: idx}
			});
		}
	}

	handleStorageUpload = (data) => {
		const allowAllNavbarButtons = () => {
			for (let i=0; i<this.state.menu.options.length; i++) {
				this.state.menu.options[i][1] = true;
				this.setState(this.state);
			}

			mutateState(this, {databaseStarted: true})
		}

		try {
			if (data == "") {
				allowAllNavbarButtons();
				return "";
			}

			let parsedData = JSON.parse(data);

			let required = ["boxes", "components", "componentTotal", "boxTotal"];
			for (let i=0; i<required.length; i++) {
				if (!parsedData.hasOwnProperty(required[i])) return "File invalid: missing required property '"+required[i]+"'";
			}

			this.state.store = {
				"boxes": parsedData.boxes,
				"components": parsedData.components,
				"componentTotal": parsedData.componentTotal,
				"boxTotal": parsedData.boxTotal
			};
			this.setState(this.state)

			allowAllNavbarButtons();
			return "";
		} catch(e) {
			return "Error: "+e;
		}
	}

	handleFileSave = () => {
    	let jsonSave = JSON.stringify(this.state.store);
    	var blob = new Blob([jsonSave], {type: "text/plain;charset=utf-8"});
      	saveAs(blob, "storage.json");
    }

    generateBoxes = store => {
    	let content = [];
    	for (let idx=0; idx<this.state.store.boxes.length; idx++) {
    		let box = this.state.store.boxes[idx];
    		content.push(<ComponentBox
    			box={box}
    			getComponentInfo={uuid => {
    				let component = componentLookup(this.state.store, uuid);
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
					return info;
    			}}
    			key={idx}
    		/>)
    		content.push(<br />)
    	}

    	return content;
    }

	render() {
		console.log("CurrentState: "+this.state.menu.selected)


		var content;
		switch(this.state.menu.selected) {
			case this.nameToMenuIdx("Load/Store DB"):
				content = (
					<DatabaseLS
						handleStorageUpload={this.handleStorageUpload}
						componentTotal={this.state.store.componentTotal}
						boxTotal={this.state.store.boxTotal}
						databaseStarted={this.state.databaseStarted}
						handleFileSave={this.handleFileSave}
					/>
				)
				break;
			case this.nameToMenuIdx("Display Boxes"):
				content = (
					<div style={{"paddingLeft": "10px"}}>
						<h1> All Boxes </h1>
						{this.generateBoxes(this.state.store)}
					</div>
				)
				break;
			case this.nameToMenuIdx("Lookup"):
				break;
			default:
				content = (
					<h1 style={{"color": "red"}}> Uh oh! Undefined state '{this.menuIdxToName(this.state.menu.selected) || this.state.menu.selected}' :( </h1>
				)
				break;
		}

		return [
			<NavHeader
				selected={this.state.menu.selected}
				tabs={this.state.menu.options}
				handleChange={this.handleMenuChange}
			/>,
			content
		]
	}

	menuIdxToName = idx => {
		return this.state.menu.options[idx] || false;
	}

	nameToMenuIdx = name => {
		for (let i=0; i<this.state.menu.options.length; i++) {
			if (this.state.menu.options[i][0].toLowerCase() == name.toLowerCase()) return i;
		}

		return false;
	}
}


ReactDOM.render(
  <Boxie />,
  document.getElementById('root')
);


