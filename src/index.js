//Basic react deps
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Addtl nodejs libs
import { saveAs } from 'file-saver';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

//Specific components
import StorageBox from './StorageBox.jsx'
import DatabaseLS from "./databaseLS.jsx"
import NavHeader from './NavHeader.jsx'

//Util functions
import mutateState from './mutateState.jsx'
import {componentLookup, getFreeSpaceInBox, getFilledSpaceInBox} from "./utils/lookup.js";
import {componentDefinitions as cDefs} from "./utils/componentDefinitions.js"

import storage from './storageTemp.jsx';


/*
TODO: Dark mode https://tombrow.com/dark-mode-website-css and https://web.dev/prefers-color-scheme/
fix box rendering sideways
react grid draggable:
1) https://yudhajitadhikary.medium.com/implementation-of-drag-drop-using-react-grid-layout-76c4f8c03565
2) https://github.com/react-grid-layout/react-grid-layout/blob/master/test/examples/0-showcase.jsx
*/

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
			boxSelectedIdx: "",
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

			this.state.boxSelectedIdx = 0;
			this.state.store = {
				"boxes": parsedData.boxes,
				"components": parsedData.components,
				"componentTotal": parsedData.componentTotal,
				"boxTotal": parsedData.boxTotal,
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

    handleBoxChange = (newBox, idx) => {
    	this.state.store.boxes[idx] = newBox;
    }

    generateBoxes = () => {
    	//Render all boxes
    	let content = [];
    	let bIdx = this.state.boxSelectedIdx;
    	if (bIdx == -1) {
	    	for (let idx=0; idx<this.state.store.boxes.length; idx++) {
	    		let box = this.state.store.boxes[idx];
	    		content.push(<StorageBox
	    			box={box}
	    			getComponent={uuid => {
	    				return componentLookup(this.state.store, uuid);
	    			}}
	    			handleBoxChange={newBox => {
	    				this.handleBoxChange(newBox, idx)
	    			}}
	    			key={idx}
	    		/>)
	    		content.push(<br />)
	    		content.push(<hr />)
	    	}
	    } else {
    		content.push(<StorageBox
    			box={this.state.store.boxes[bIdx]}
    			getComponent={uuid => {
    				return componentLookup(this.state.store, uuid);
    			}}
    			handleBoxChange={newBox => {
    				this.handleBoxChange(newBox, bIdx)
    			}}
    			key={bIdx}
    		/>)
	    }

    	return content;
    }

    handleBoxSelect = (event) => {
    	let value = event.target.value;
    	mutateState(this, {boxSelectedIdx: value})
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
				let boxSelectors = [];
				for (let idx=0; idx<this.state.store.boxes.length; idx++) {
					let box = this.state.store.boxes[idx];
					let title = box.title;
					let space = getFilledSpaceInBox(box);
    				boxSelectors.push(<option disabled={space==0?true:false} value={idx}>{title}</option>);
    			}

				content = (
					<div style={{"paddingLeft": "10px"}}>
						<h1> Box Display </h1>
						<FormControl variant="outlined">
					        <InputLabel htmlFor="outlined-age-native-simple">Selected Box</InputLabel>
					        <Select
					          native
					          value={this.state.boxSelectedIdx}
					          onChange={this.handleBoxSelect}
					          label="Selected Box"
					          inputProps={{
					            name: 'Selected Box',
					            id: 'outlined-age-native-simple',
					          }}
					        >
					          {boxSelectors}
					        </Select>
					    </FormControl>
						{this.generateBoxes()}
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


