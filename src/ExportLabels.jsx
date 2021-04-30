//ExportLabels class which displays a ui for printing labels
import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
});

class ExportLabels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h1> Export Labels </h1>
      </div>
    );
  }
}

ExportLabels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExportLabels);
