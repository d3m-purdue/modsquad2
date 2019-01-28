import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { json } from 'd3-request';
import { setActiveStep, getPipelinePredictions } from '../actions';
import { getSteps } from '../constants';

const styles = theme => ({
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 52,
    background: '#f5f5f5',
    textAlign: 'center'
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  buttonsContainer: {
    width: 300,
    margin: 'auto',
    textAlign: 'center',
    position: 'fixed',
    bottom: 0,
    height: 45,
    left: 0,
    right: 0,
    overflow: 'hidden'
  }
});

const Footer = ({
  classes, activeStep, state, handleClick
}) => {
  if (activeStep === undefined) {
    return (<div />);
  }
  const steps = getSteps();
  // const { activeStep } = this.state;

  return (
    <div className={classes.footer}>
      <div className={classes.buttonsContainer}>
        <Button
          variant="raised"
          disabled={activeStep === 0}
          onClick={() => handleClick(activeStep - 1, state)}
          className={classes.backButton}
        >
          Back
        </Button>
        <Button variant="raised" color="primary" onClick={() => handleClick(activeStep + 1, state)}>
          {activeStep === steps.length - 1 ? 'Stop and Return' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  activeStep: state.activeStep,
  selectedPipelines: state.selectedPipelines,
  selectedExternalDatasets: state.selectedExternalDatasets,
  state
});

const mapDispatchToProps = dispatch => ({
  handleClick: (val, state) => {
    if (val === getSteps().length) {
      // stop the ta2
      // TODO: manage this with redux?
      json('/stopProcess', (returncode) => {
        console.log('stop return code was', returncode);
      });
      dispatch(setActiveStep(0));
    } else if (val === 4) {
      // LOAD DATA HERE... - the selected dataset will be availablei in state.selectedExternalDatasets
      dispatch(setActiveStep(val));
    } else if (val === 7) {
      // kick off reading in pipeline results
      getPipelinePredictions(state, dispatch);
      dispatch(setActiveStep(val));
    } else {
      dispatch(setActiveStep(val));
    }
    window.scrollTo(0, 0);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Footer));
