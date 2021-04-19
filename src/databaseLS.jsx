//ComponentBox class that holds one displayed box
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import mutateState from './mutateState.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const fs = require("fs")

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    "padding-left": theme.spacing(2)
  }
});

function FileList(props) {
	if (props.files && props.files.length > 0) {
		let content = [];
		Array.from(props.files).map((file, idx) => {
			content.push(<p key={idx}> Selected file: {file.name} </p>);
		})
		content.push(
			<Button variant="contained" color="primary" onClick={props.handleFileUpload} disabled={props.uploadingFile}>
				Upload File
			</Button>
		)
		return content;
	} else {
		return (
			<p> No file selected. </p>
		)
	}
}

class DatabaseLS extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedFiles: null,
			uploadingFile: false,
			databaseStarted: false,
			dialog: {
				open: false
			}
		}
	}

	handleFileChange = event => {
      	// Update the state
      	this.setState({ selectedFiles: event.target.files });
    };

    handleFileUpload = () => {
    	mutateState(this, {uploadingFile: true})

    	let files = this.state.selectedFiles;

    	let reader = new FileReader(); // no arguments
    	reader.readAsText(files[0])

    	reader.onload = () => {
			let message = this.props.handleStorageUpload(reader.result);
			if (message != "") {
				this.handleDialogOpen(message);
			}
			mutateState(this, {uploadingFile: false})
		};

		reader.onerror = function() {
			this.handleDialogOpen("Error uploading file: '"+reader.error+"'")
			mutateState(this, {uploadingFile: false})
		};
    }

    handleDialogClose = () => {
    	mutateState(this, {dialog: {open: false}})
    }

    handleDialogOpen = (text) => {
    	mutateState(this, {dialog: {open: true, text: text}})
    }

    handleNewDB = () => {
    	this.props.handleStorageUpload("");
    }

	render() {
		const {classes} = this.props;

		return (
			<div className={classes.root}>
				<h1> Load/Store Database File </h1>
				<h3> Loaded component count: {this.props.componentTotal}</h3>
				<h3> Loaded box count: {this.props.boxTotal}</h3>
				
				<div style={{display: this.props.databaseStarted ? "none" : "block"}}>
					<input
						accept="json/*"
						style={{ display: 'none' }}
						id="raised-button-file"
						type="file"
						multiple
						onChange={this.handleFileChange}
						disabled={this.state.uploadingFile}
					/>

					<Button size="large" variant="contained" color="primary" component="span" onClick={this.handleNewDB} disabled={this.state.uploadingFile}>
					    Start New DB &nbsp;
					    <AddCircleOutlineIcon />
					</Button>

					<br />
					<p> Alternatively, select a file: </p>

					<label htmlFor="raised-button-file">
					  <Button size="large" variant="contained" color="primary" component="span" disabled={this.state.uploadingFile}>
					    Select File &nbsp;
					    <DescriptionIcon />
					  </Button>
					  <FileList
					  	files={this.state.selectedFiles}
					  	handleFileUpload={this.handleFileUpload}
					  	uploadingFile={this.state.uploadingFile}
					  />
					</label>

					<Dialog
						open={this.state.dialog.open}
						onClose={this.handleDialogClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
					<DialogTitle id="alert-dialog-title">{"File Upload"}</DialogTitle>
					<DialogContent>
					  <DialogContentText id="alert-dialog-description">
					    {this.state.dialog.text}
					  </DialogContentText>
					</DialogContent>
					<DialogActions>
					  <Button size="large" onClick={this.handleDialogClose} color="primary">
					    Dismiss
					  </Button>
					</DialogActions>
					</Dialog>
				</div>

				<div style={{display: this.props.databaseStarted ? "block" : "none"}}>
					<Button onClick={this.props.handleFileSave} size="large" variant="contained" color="primary">
						Save File
					</Button>
				</div>
			</div>
		)
	}

	
}

DatabaseLS.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DatabaseLS);
