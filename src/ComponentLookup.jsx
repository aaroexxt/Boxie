//ExportLabels class which displays a ui for printing labels
import React from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import { withStyles } from "@material-ui/core/styles";

import mutateState from "./mutateState.jsx";
import { componentLookupAndPosition } from "./utils/lookup.js";
import { componentDefinitions as cDefs } from "./utils/componentDefinitions.js";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
});

class ComponentLookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: cDefs.types[Object.keys(cDefs.types)[0]],
      filters: {
        type: true,
        size: false,
      },
    };
  }

  handleTypeChange(event) {
    this.setState({ value: event.target.value });
  }

  generateTypeLabels() {
    let content = [];
    let keys = Object.keys(cDefs.types);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      content.push(
        <FormControlLabel
          value={cDefs.types[key]}
          control={<Radio />}
          label={cDefs.types[key]}
        />
      );
    }
    return content;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h2> Component Lookup </h2>

        <FormControl component="fieldset">
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Filter "
            labelPlacement="start"
          />
          <RadioGroup
            aria-label="type"
            name="type"
            value={this.state.value}
            onChange={(event) => {
              this.handleTypeChange(event);
            }}
            row
          >
            {this.generateTypeLabels()}
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

ComponentLookup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComponentLookup);
