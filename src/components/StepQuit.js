import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

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

const StepQuit = ({ classes }) => (
  <div>
    <Typography variant="headline" className={classes.title}>
      Thank You for Trying Out the Purdue ModSquad TA3 System
    </Typography>
    <Typography className={classes.p}>
      Please click the button below to stop the TA3 system and end this working session.
    </Typography>
  </div>
);

StepQuit.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StepQuit);
