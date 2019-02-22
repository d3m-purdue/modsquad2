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

const StepGeoApp = ({ classes }) => (
  <div>
    <Typography variant="headline" className={classes.title}>
       Geospatial dataset interface
    </Typography>
    <Typography className={classes.p}>
    Explore and extract geospatial, temporal datasets through interactive
   filtering.  
    </Typography>


    <Iframe url="https://purdue-geoapp.datadrivendiscovery.org"
        width="1100px"
        height="700px"
        id="myId"
        className="GeoApp"
        display="initial"
        position="relative"
        allowFullScreen/>

  </div>
);

StepGeoApp.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StepGeoApp);
