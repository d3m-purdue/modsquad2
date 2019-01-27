import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Iframe from 'react-iframe';


const styles = {
  flex: {
    flex: 1
  },
  p: {
    marginBefore: '1em',
    marginAfter: '1em'
  },
  title: {
    fontWeight: 500,
    textAlign: 'center'
  }
};

const StepDatasetPanel = ({ classes }) => (
  <div>
    <Typography className={classes.p}>
    If needed, Browse, review, and upload additional datasets for later analysis
    </Typography>

    <Iframe url="https://purdue-datasets.datadrivendiscovery.org"
        width="1100px"
        height="800px"
        id="myId"
        className="GeoApp"
        display="initial"
        position="relative"
        allowFullScreen/>

  </div>
);

StepDatasetPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StepDatasetPanel);
