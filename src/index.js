//Basic react deps
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Specific components
import ComponentBox from './componentBox.jsx'
import DatabaseLS from "./databaseLS.jsx"
import NavHeader from './NavHeader.jsx'

import mutateState from './mutateState.jsx'
import { saveAs } from 'file-saver';

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
					["Add", false],
					["Delete", false],
					["Save Data", false],
					["Display Boxes", false],
					["Lookup", false],
					["Export Labels", false],
					["BOM Management", false]
				],
				selected: 0
			},
			databaseStarted: false
		}
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
		console.log("Save")
    	let jsonSave = JSON.stringify(this.state.store);
    	var blob = new Blob([jsonSave], {type: "text/plain;charset=utf-8"});
      	saveAs(blob, "storage.json");
    }

	render() {
		console.log("CurrentState: "+this.state.menu.selected)


		var content;
		switch(this.state.menu.selected) {
			case this.nameToMenuIdx("Load Box"):
				content = (
					<h1> pog </h1>
				)
				break;
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
				content = this.state.boxes;
				break;
			case this.nameToMenuIdx("Lookup"):
				return 
			default:
				content = (
					<h1 style={{"color": "red"}}> Uh oh! Undefined state '{this.menuIdxToName(this.state.menu.selected) || this.state.menu.selected}' :( </h1>
				)
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


