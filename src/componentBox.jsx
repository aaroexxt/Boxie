//ComponentBox class that holds one displayed box
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button'

export default class ComponentBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Button variant="contained" color="primary">
				This is a test
			</Button>
		)
	}
}