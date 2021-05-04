//ExportLabels class which displays a ui for printing labels
import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
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

import ComponentInfo from "./ComponentInfo.jsx";
import mutateState from "./mutateState.jsx";
import { ratcliffObershelp } from "./utils/stringCompare.js";
import { componentLookupAndPosition } from "./utils/lookup.js";
import { componentDefinitions as cDefs } from "./utils/componentDefinitions.js";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
});

function SizeFilter(props) {
  let content = [];
  let keys = Object.keys(cDefs.smdSizes);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    content.push(
      <FormControlLabel
        key={cDefs.smdSizes[key] + "-" + i}
        value={cDefs.smdSizes[key]}
        control={<Radio />}
        label={cDefs.smdSizes[key]}
      />
    );
  }

  let innerContent = [];
  if (props.value == cDefs.smdSizes.ICPACKAGES) {
    let keys = Object.keys(cDefs.ICPackages);
    for (let i = 0; i < keys.length; i++) {
      innerContent.push(<h4>{keys[i]}</h4>);
      innerContent.push(<br />);
      for (let j = 0; j < cDefs.ICPackages[keys[i]].length; j++) {
        innerContent.push(
          <FormControlLabel
            key={"SMD-" + cDefs.ICPackages[keys[i]][j] + "-" + i}
            value={"SMD-" + cDefs.ICPackages[keys[i]][j]}
            control={<Radio />}
            label={cDefs.ICPackages[keys[i]][j]}
          />
        );
        innerContent.push(<br />);
      }
    }

    return (
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="size"
          name="size"
          value={props.value}
          onChange={(e) => {
            props.onChange(e);
          }}
        >
          {innerContent}
        </RadioGroup>
      </FormControl>
    );
  } else {
    let fContent = [];

    let allPackages = [];
    let keys = Object.keys(cDefs.ICPackages);
    for (let i = 0; i < keys.length; i++) {
      allPackages = allPackages.concat(
        cDefs.ICPackages[keys[i]].map((item) => {
          return "SMD-" + item;
        })
      );
    }
    if (allPackages.indexOf(props.value) != -1) {
      fContent.push(
        <h3 style={{ color: "blue" }}>
          Note: SMDComponent Value '{props.value}' Selected
        </h3>
      );
    }

    return (
      <div>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="size"
            name="size"
            value={props.value}
            onChange={(e) => {
              props.onChange(e);
            }}
            row
          >
            {content}
          </RadioGroup>
        </FormControl>
        {fContent}
      </div>
    );
  }
}

function ManufacturerFilter(props) {
  let content = [];

  let mfgs = JSON.parse(JSON.stringify(cDefs.manufacturers));
  mfgs.unshift("Other");
  for (let i = 0; i < mfgs.length; i++) {
    let key = mfgs[i];
    content.push(
      <FormControlLabel
        key={key + "-" + i}
        value={key}
        control={<Radio />}
        label={key}
      />
    );
  }

  if (
    (props.value == mfgs[0] || mfgs.indexOf(props.value) == -1) &&
    props.value != ""
  ) {
    // "other" value selected
    return (
      <TextField
        label="Manufacturer"
        defaultValue="Delete to return"
        variant="outlined"
        onChange={(e) => {
          props.onChange(e);
        }}
      />
    );
  } else {
    return (
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="manufacturer"
          name="manufacturer"
          value={props.value}
          onChange={(e) => {
            props.onChange(e);
          }}
          row
        >
          {content}
        </RadioGroup>
      </FormControl>
    );
  }
}

function ValueFilter(props) {
  var content = [];
  var innerContent = [];
  switch (props.type) {
    case cDefs.types.RESISTOR:
      content.push(
        <TextField
          label="Resistance"
          variant="outlined"
          onChange={(e) => {
            props.onChangeValue(e);
          }}
        />
      );
      content.push(<br />);

      let rUnits = cDefs.units[cDefs.types.RESISTOR];
      for (let i = 0; i < rUnits.resistance.length; i++) {
        let unit = rUnits.resistance[i][0];
        innerContent.push(
          <FormControlLabel
            key={unit + "-" + i}
            value={unit}
            control={<Radio />}
            label={unit}
          />
        );
      }

      content.push(
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Unit"
            name="Unit"
            value={props.unit}
            onChange={(e) => {
              props.onChangeUnit(e);
            }}
            row
          >
            {innerContent}
          </RadioGroup>
        </FormControl>
      );
      break;
    case cDefs.types.CAPACITOR:
      content.push(
        <TextField
          label="Capacitance"
          variant="outlined"
          onChange={(e) => {
            props.onChangeValue(e);
          }}
        />
      );
      content.push(<br />);

      let cUnits = cDefs.units[cDefs.types.CAPACITOR];
      for (let i = 0; i < cUnits.capacitance.length; i++) {
        let unit = cUnits.capacitance[i][0];
        innerContent.push(
          <FormControlLabel
            key={unit + "-" + i}
            value={unit}
            control={<Radio />}
            label={unit}
          />
        );
      }

      content.push(
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Unit"
            name="Unit"
            value={props.unit}
            onChange={(e) => {
              props.onChangeUnit(e);
            }}
            row
          >
            {innerContent}
          </RadioGroup>
        </FormControl>
      );
      break;
    case cDefs.types.CRYSTAL:
      content.push(
        <TextField
          label="Frequency"
          variant="outlined"
          onChange={(e) => {
            props.onChangeValue(e);
          }}
        />
      );
      content.push(<br />);

      let crUnits = cDefs.units[cDefs.types.CRYSTAL];
      for (let i = 0; i < crUnits.frequency.length; i++) {
        let unit = crUnits.frequency[i];
        innerContent.push(
          <FormControlLabel
            key={unit + "-" + i}
            value={unit}
            control={<Radio />}
            label={unit}
          />
        );
      }

      content.push(
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Unit"
            name="Unit"
            value={props.unit}
            onChange={(e) => {
              props.onChangeUnit(e);
            }}
            row
          >
            {innerContent}
          </RadioGroup>
        </FormControl>
      );
      break;
    case cDefs.types.LED:
      content.push(
        <TextField
          label="Color"
          variant="outlined"
          onChange={(e) => {
            props.onChangeValue(e);
            props.onChangeUnit(e);
          }}
        />
      );
      break;
    case cDefs.types.IC:
    case cDefs.types.OTHER:
      content.push(
        <TextField
          label="Identifier"
          variant="outlined"
          onChange={(e) => {
            props.onChangeValue(e);
          }}
          style={{ paddingRight: "10px" }}
        />
      );
      content.push(
        <TextField
          label="Description"
          variant="outlined"
          onChange={(e) => {
            props.onChangeUnit(e);
          }}
        />
      );
      content.push(<h4>Leave field blank to skip filtering by ID or value</h4>);
      break;
  }

  return content;
}

class ComponentLookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        type: [true, cDefs.types[Object.keys(cDefs.types)[0]]],
        size: [true, cDefs.smdSizes[Object.keys(cDefs.smdSizes)[0]]],
        value: [true, "", ""],
        manufacturer: [false, cDefs.manufacturers[0]],
        quantity: [false, 0, 100],
      },
      allDisabled: false,
      filteredComponents: [],
    };
  }

  handleInputChange(type, event) {
    switch (type) {
      case "size":
        this.state.filters[type][1] = event.target.value;
        break;
      case "type":
        this.state.filters[type][1] = event.target.value;
        //reset id and value
        this.state.filters["value"][1] = "";
        this.state.filters["value"][2] = "";
        break;
      case "manufacturer":
        if (event.target.value == "") {
          this.state.filters[type][1] = cDefs.manufacturers[0];
        } else {
          this.state.filters[type][1] = event.target.value;
        }
        break;
      case "quantity-min":
        this.state.filters["quantity"][1] = Number(event.target.value);
        break;
      case "quantity-max":
        this.state.filters["quantity"][2] = Number(event.target.value);
        break;
      case "value-data":
        this.state.filters["value"][1] = String(event.target.value);
        break;
      case "value-unit":
        this.state.filters["value"][2] = String(event.target.value);
        break;
    }
    this.setState(this.state);
  }

  handleVisibilityChange(type, event) {
    try {
      this.state.filters[type][0] = event.target.checked;
      if (type == "type" && !event.target.checked) {
        this.state.filters["value"][0] = false; //if type is disabled, value also has to be
      }

      let keys = Object.keys(this.state.filters);
      this.state.allDisabled = true;
      for (let i = 0; i < keys.length; i++) {
        if (this.state.filters[keys[i]][0]) {
          this.state.allDisabled = false;
          break;
        }
      }
      this.setState(this.state);
    } catch (e) {
      console.error(
        "Failed to set componentLookup visibility with type '" + type + "'"
      );
    }
  }

  generateTypeLabels() {
    let content = [];
    let keys = Object.keys(cDefs.types);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      content.push(
        <FormControlLabel
          key={cDefs.types[key] + "-" + i}
          value={cDefs.types[key]}
          control={<Radio />}
          label={cDefs.types[key]}
        />
      );
    }
    return content;
  }

  handleFilter() {
    let components = JSON.parse(JSON.stringify(this.props.store.components));
    let goodComponents = [];

    let filters = this.state.filters;
    for (let item of components) {
      let componentOK = true;

      //Type filter
      if (filters.type[0]) {
        if (item.type != filters.type[1]) componentOK = false;
      }
      //Size filter
      if (filters.size[0]) {
        if (item.size != filters.size[1]) componentOK = false;
      }
      //Manufacturer filter
      if (filters.manufacturer[0]) {
        //Use string pattern matching algorithm to correct for spelling mistakes, etc.
        if (ratcliffObershelp(item.manufacturer, filters.manufacturer[1]) < 0.5)
          componentOK = false;
      }
      //Quantity filter
      if (filters.quantity[0]) {
        if (filters.quantity[1] != -1) {
          //do we have a minimum?
          if (item.quantity < filters.quantity[1]) componentOK = false;
        }

        if (filters.quantity[2] != -1) {
          //do we have a maximum?
          if (item.quantity > filters.quantity[2]) componentOK = false;
        }
      }
      //Value filter (value, unit)
      if (filters.value[0]) {
        let unitMatch;
        let normValue;
        let units;
        switch (item.type) {
          case cDefs.types.RESISTOR:
            if (filters.value[1] && filters.value[2]) {
              unitMatch = false;
              normValue = -1;
              units = cDefs.units[cDefs.types.RESISTOR].resistance;
              for (let i = 0; i < units.length; i++) {
                if (units[i][0] == filters.value[2]) {
                  unitMatch = true;
                  normValue = filters.value[1] * units[i][2]; //normalize the value
                  break;
                }
              }

              if (!unitMatch || normValue != item.additional.normalizedValue)
                componentOK = false;
            }
            break;
          case cDefs.types.CAPACITOR:
            if (filters.value[1] && filters.value[2]) {
              unitMatch = false;
              normValue = -1;
              units = cDefs.units[cDefs.types.CAPACITOR].capacitance;
              for (let i = 0; i < units.length; i++) {
                if (units[i][0] == filters.value[2]) {
                  unitMatch = true;
                  normValue = filters.value[1] * units[i][2]; //normalize the value
                  break;
                }
              }

              if (!unitMatch || normValue != item.additional.normalizedValue)
                componentOK = false;
            }
            break;
          case cDefs.types.CRYSTAL:
            if (filters.value[1] && filters.value[2]) {
              if (
                filters.value[1] != item.additional.frequency ||
                filters.value[2] != item.additional.frequencyUnit
              )
                componentOK = false;
            }
            break;
          case cDefs.types.LED:
            if (filters.value[1]) {
              if (
                ratcliffObershelp(item.additional.color, filters.value[1]) < 0.8
              )
                componentOK = false;
            }
            break;
          case cDefs.types.IC:
          case cDefs.types.OTHER:
            //check Identifier
            if (filters.value[1]) {
              if (
                ratcliffObershelp(
                  item.additional.identifier,
                  filters.value[1]
                ) < 0.6
              )
                componentOK = false;
            }
            //Check description
            if (filters.value[2]) {
              if (
                item.additional.description.indexOf(filters.value[2]) == -1 &&
                ratcliffObershelp(
                  item.additional.description,
                  filters.value[2]
                ) < 0.5
              )
                componentOK = false;
            }
            break;
        }
      }

      if (componentOK) goodComponents.push(item);
    }

    this.state.filteredComponents = goodComponents;
    this.setState(this.state);

    try {
      this.props.handleFilter(goodComponents);
    } catch (e) {
      console.warn(
        "ComponentLookup: failed to call handleFilter props function"
      );
    }
  }

  generateFilteredComponentList() {
    let content = [];

    if (this.state.filteredComponents.length > 0) {
      content.push(
        <h2>
          Search Matched {this.state.filteredComponents.length} Component(s)
        </h2>
      );
      for (let i = 0; i < this.state.filteredComponents.length; i++) {
        let item = this.state.filteredComponents[i];
        let component = componentLookupAndPosition(this.props.store, item.uuid);

        content.push(<ComponentInfo fetched={component} />);
      }
    }
    return content;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h2> Component Lookup </h2>

        {/* Start with all the filter options */}
        <h3>Filter by:</h3>
        <FormControlLabel
          value="start"
          control={
            <Switch
              color="primary"
              checked={this.state.filters["type"][0]}
              onChange={(e) => {
                this.handleVisibilityChange("type", e);
              }}
            />
          }
          label="Type"
          labelPlacement="top"
        />
        <FormControlLabel
          value="start"
          control={
            <Switch
              color="primary"
              checked={this.state.filters["value"][0]}
              onChange={(e) => {
                this.handleVisibilityChange("value", e);
              }}
              disabled={!this.state.filters["type"][0]}
            />
          }
          label="Value"
          labelPlacement="top"
        />
        <FormControlLabel
          value="start"
          control={
            <Switch
              color="primary"
              checked={this.state.filters["size"][0]}
              onChange={(e) => {
                this.handleVisibilityChange("size", e);
              }}
            />
          }
          label="Size"
          labelPlacement="top"
        />
        <FormControlLabel
          value="start"
          control={
            <Switch
              color="primary"
              checked={this.state.filters["manufacturer"][0]}
              onChange={(e) => {
                this.handleVisibilityChange("manufacturer", e);
              }}
            />
          }
          label="Manufacturer"
          labelPlacement="top"
        />
        <FormControlLabel
          value="start"
          control={
            <Switch
              color="primary"
              checked={this.state.filters["quantity"][0]}
              onChange={(e) => {
                this.handleVisibilityChange("quantity", e);
              }}
            />
          }
          label="Quantity"
          labelPlacement="top"
        />
        <br />

        {/* Now all of the elements that are actually selectable */}
        <div style={{ display: this.state.filters.type[0] ? "block" : "none" }}>
          <h3>Type Filter</h3>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="type"
              name="type"
              value={this.state.filters.type[1]}
              onChange={(e) => {
                this.handleInputChange("type", e);
              }}
              row
            >
              {this.generateTypeLabels()}
            </RadioGroup>
          </FormControl>
        </div>
        <div
          style={{ display: this.state.filters.value[0] ? "block" : "none" }}
        >
          <h3>Value Filter</h3>
          <ValueFilter
            value={this.state.filters.value[1]}
            unit={this.state.filters.value[2]}
            type={this.state.filters.type[1]}
            onChangeValue={(e) => {
              this.handleInputChange("value-data", e);
            }}
            onChangeUnit={(e) => {
              this.handleInputChange("value-unit", e);
            }}
          />
        </div>
        <div style={{ display: this.state.filters.size[0] ? "block" : "none" }}>
          <h3>Size Filter</h3>
          <SizeFilter
            value={this.state.filters.size[1]}
            onChange={(e) => {
              this.handleInputChange("size", e);
            }}
          />
        </div>
        <div
          style={{
            display: this.state.filters.manufacturer[0] ? "block" : "none",
          }}
        >
          <h3>Manufacturer Filter</h3>
          <ManufacturerFilter
            value={this.state.filters.manufacturer[1]}
            onChange={(e) => {
              this.handleInputChange("manufacturer", e);
            }}
          />
        </div>
        <div
          style={{
            display: this.state.filters.quantity[0] ? "block" : "none",
          }}
        >
          <h3>Quantity Filter</h3>
          <h4>Use -1 for no filter</h4>
          <TextField
            required
            label="Minimum"
            defaultValue={this.state.filters.quantity[1]}
            variant="outlined"
            onChange={(e) => {
              this.handleInputChange("quantity-min", e);
            }}
          />
          &nbsp;
          <TextField
            required
            label="Maximum"
            defaultValue={this.state.filters.quantity[2]}
            variant="outlined"
            onChange={(e) => {
              this.handleInputChange("quantity-max", e);
            }}
          />
        </div>

        <br />
        {/*Sort button and info statements*/}
        <div style={{ display: this.state.allDisabled ? "block" : "none" }}>
          <h3>Enable a filtering option above</h3>
        </div>
        <Button
          onClick={() => {
            this.handleFilter();
          }}
          variant="contained"
          color="primary"
          size="large"
          disabled={this.state.allDisabled}
        >
          Filter
        </Button>
        {/* Final component display */}
        <div style={{ display: this.props.showFiltered ? "block" : "none" }}>
          {this.generateFilteredComponentList()}
        </div>
      </div>
    );
  }
}

ComponentLookup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComponentLookup);
