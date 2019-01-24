import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';

import StepWelcome from './StepWelcome';
import StepGeoApp from './StepGeoApp';
import StepDatasets from './StepDatasets';
import StepVariables from './StepVariables';
import StepExploratory from './StepExploratory';
import StepModel from './StepModel';
import StepModelResults from './StepModelResults';
import StepQuit from './StepQuit';
import { getSteps } from '../constants';

const styles = theme => ({
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 70
  },
  stepper: {
    width: '100%',
    maxWidth: 1000,
    margin: 'auto'
  },
  body: {
    position: 'fixed',
    top: 170,
    bottom: 55,
    left: 0,
    right: 0,
    overflow: 'auto'
  },
  content: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    width: '100%',
    maxWidth: 950,
    margin: 'auto'
  }
});

const getStepContent = (stepIndex) => {
  switch (stepIndex) {
    case 0:
      return (<StepWelcome />);
    case 1:
      return (<StepGeoApp />)
    case 2:
      return (<StepDatasets />)
    case 3:
      return (<StepVariables />);
    case 4:
      return (<StepExploratory />);
    case 5:
      return (<StepModel />);
    case 6:
      return (<StepModelResults />);
    case 7:
      return (<StepQuit />);

    default:
      return 'Uknown stepIndex';
  }
};

const Body = ({ classes, activeStep }) => {
  if (activeStep === undefined) {
    return (<div />);
  }
  const steps = getSteps();

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.stepper}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
      <div className={classes.body}>
        <div className={classes.content}>
          {getStepContent(activeStep)}
        </div>
      </div>
    </div>
  );
};

Body.propTypes = {
  classes: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  activeStep: state.activeStep
});

export default connect(
  mapStateToProps
)(withStyles(styles)(Body));
