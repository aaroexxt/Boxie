//ExportLabels class which displays a ui for printing labels
import React from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

import { withStyles } from "@material-ui/core/styles";
import {
  exportBoxLabels,
  exportComponentLabels,
  getImageSize,
} from "./utils/export.js";

import mutateState from "./mutateState.jsx";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    fontSize: "20px",
    backgroundColor: "#eee",
  },
  message: {
    fontSize: "20px",
    paddingLeft: "10px",
  },
});

class ExportLabels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      exportedImageData: [],
    };
  }

  generateBoxSheets() {
    let store = this.props.store;

    if (store.boxes.length == 0) return;

    this.state = {
      message: "Generating box labels...",
      exportedImageData: [],
    };
    exportBoxLabels(store.boxes, (b64) => {
      this.state.exportedImageData.push(b64);
    })
      .then(() => {
        mutateState(this, { message: "Box labels generated successfully" });
      })
      .catch(() => {
        mutateState(this, { success: "Box labels failed to generate :(" });
      });
  }

  generateComponentSheets() {
    let store = this.props.store;

    if (store.components.length == 0 || store.boxes.length == 0) return;

    this.state = {
      message: "Generating component labels...",
      exportedImageData: [],
    };

    exportComponentLabels(store.components, store.boxes, (b64) => {
      this.state.exportedImageData.push(b64);
    })
      .then(() => {
        mutateState(this, {
          message: "Component labels generated successfully",
        });
      })
      .catch(() => {
        mutateState(this, {
          success: "Component labels failed to generate :(",
        });
      });
  }

  generateSessionComponentSheets() {
    let store = this.props.store;

    this.state = {
      message: "Generating session component labels...",
      exportedImageData: [],
    };

    exportComponentLabels(store.sessionComponents, store.boxes, (b64) => {
      this.state.exportedImageData.push(b64);
    })
      .then(() => {
        mutateState(this, {
          message: "Component labels for session generated successfully",
        });
      })
      .catch(() => {
        mutateState(this, {
          success: "Component labels for session failed to generate :(",
        });
      });
  }

  printImages() {
    if (this.state.exportedImageData.length == 0) return;
    const myW = window.open("boxiePrint", "Image");
    let dims = getImageSize();

    //Inject a bunch of CSS to get it to print properly
    myW.document.write(
      `<style>
      html, body {
          height: 100%;
          margin: 0;
          padding: 0;
      }

      img {
          padding: 0;
          display: block;
          margin: 0 auto;
          max-height: 100%;
          max-width: 100%;
      }
      @media print {
          @page
          {
              size: auto;   /* auto is the initial value */
              margin: 0mm;  /* this affects the margin in the printer settings */
          }
          .pagebreak {
              clear: both;
              page-break-after: always;
          }
      }
  </style>`
    );
    myW.document.write("<div>");

    for (let i = 0; i < this.state.exportedImageData.length; i++) {
      let imageData = this.state.exportedImageData[i];
      myW.document.write('<img src="' + imageData + '"></img>');
      myW.document.write('<div class="pagebreak"></div>');
    }

    myW.document.write("</div>");

    myW.document.write(`
      <script>
        setTimeout(() => {
          window.print();
        }, 250);
      </script>
    `);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h1> Export Labels </h1>
        <h2> Step 1: Generate Sheets </h2>
        <Button
          className={classes.button}
          onClick={() => {
            this.generateBoxSheets();
          }}
          disabled={this.props.store.boxes.length == 0 ? true : false}
          variant="outlined"
        >
          Generate Box Sheets
        </Button>
        <Button
          className={classes.button}
          onClick={() => {
            this.generateComponentSheets();
          }}
          disabled={
            this.props.store.components.length == 0 ||
            this.props.store.boxes.length == 0
              ? true
              : false
          }
          variant="outlined"
        >
          Generate Component Sheets
        </Button>
        <Button
          className={classes.button}
          onClick={() => {
            this.generateSessionComponentSheets();
          }}
          disabled={
            this.props.store.sessionComponents.length == 0 ? true : false
          }
          variant="outlined"
        >
          Generate Session Sheets
        </Button>
        <br />
        <br />
        <hr />
        <h2> Step 2: Print Sheets </h2>
        <Button
          className={classes.button}
          onClick={() => {
            this.printImages();
          }}
          disabled={this.state.exportedImageData.length == 0 ? true : false}
          variant="outlined"
        >
          Print {this.state.exportedImageData.length} Sheet(s)
        </Button>
        <br />
        <p className={classes.message}>{this.state.message}</p>
      </div>
    );
  }
}

ExportLabels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExportLabels);
