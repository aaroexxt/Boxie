import React from 'react';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {componentDefinitions as cDefs} from "./utils/componentDefinitions.js"

const useStyles = makeStyles(theme => ({
	componentInfo: {
	  	padding: theme.spacing(1)
	}
}))

export default function ComponentInfo(props) {
	const classes = useStyles();

	let component = props.component;
	let content = [];
	content.push(<h2> Component Info </h2>)

	switch(component.type) {
		case cDefs.types.RESISTOR:
		case cDefs.types.CAPACITOR:
		case cDefs.types.LED:
			content.push(<p> Type: {component.type} | Size: {component.size} </p>)
			break;
		default:
			content.push(<p> Type: {component.type} </p>)
			content.push(<p> Size: {component.size} </p>)
			break;
	}
	switch(component.type) {
		case cDefs.types.RESISTOR:
		case cDefs.types.CAPACITOR:
			content.push(<p> Value: {component.additional.value+component.additional.valueUnit} </p>);
			break;
		case cDefs.types.IC:
		case cDefs.types.OTHER:
			content.push(<p> Identifier: {component.additional.identifier} </p>);
			content.push(<p> Description: {component.additional.description} </p>);
			break;
		case cDefs.types.CRYSTAL:
			content.push(<p> Frequency: {component.additional.frequency+component.additional.frequencyUnit} </p>);
			break;
		case cDefs.types.LED:
			content.push(<p> Color: {component.additional.color} </p>);
			break;
		default:
			content.push(<p>Info: Unknown</p>);
			break;
	}
	content.push(<hr />)
	content.push(<p> Quantity In Stock: {component.quantity} </p>)
	content.push(<p> Manufacturer: {component.manufacturer} </p>)

	return (
		<Paper className={classes.componentInfo}>
			{content}
		</Paper>
	)
}