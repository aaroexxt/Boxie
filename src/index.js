//Basic react deps
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Specific components
import ComponentBox from './componentBox.jsx'
import NavHeader from './NavHeader.jsx'

const states = {
	selectFile: 1,
	displayBoxes: 2
}

class Boxie extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			current: 0,
			boxes: []
		}
		this.handleStateChange(states.selectFile)
	}

	handleStateChange(newState) {
		let defaulted = false;
		switch(newState) {
			case states.selectFile:
				break;
			default:
				defaulted = true;
		}

		if (!defaulted) this.state.current = newState; //is it a valid state?
	}

	render() {
		console.log("CurrentState: "+this.state.current)


		var content;
		switch(this.state.current) {
			case states.selectFile:
				content = (
					<h1> pog </h1>
				)
				break;
			case states.displayBoxes:
				content = this.state.boxes;
				break;
			case states.componentLookup:
				return 
			default:
				content = (
					<h1> Uh oh! Undefined state '{this.state.current}' :( </h1>
				)
		}

		return [
			<NavHeader />,
			content
		]
	}
}


ReactDOM.render(
  <Boxie />,
  document.getElementById('root')
);


