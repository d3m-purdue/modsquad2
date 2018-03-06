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

const StepWelcome = ({ classes }) => (
  <div>
    <Typography variant="headline" className={classes.title}>
      Welcome to the D3M Purdue Data Exploration and Modeling Environment
    </Typography>
    <Typography className={classes.p}>
      This environment allows you to explore a problem by examining the data associated with the problem, invoking an automated solver to attempt a solution and, finally, reviewing the quality of the automated solution. In some situations, the automated solver will return multiple possible solutions, and you will be able to compare and select what seems to be the best one of the suggested set of possible solutions.
    </Typography>
    <Typography className={classes.p}>
      When you are ready to begin, click the 'next' button.
    </Typography>
  </div>
);

StepWelcome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StepWelcome);
