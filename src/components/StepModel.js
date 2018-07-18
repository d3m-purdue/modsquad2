import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';

import ModelTable from './ModelTable';
import {
  setTA2Port, setTA2Timeout, runTA2, setPipelineProgress
} from '../actions';
import ta2models from '../ta2models.json';

const styles = theme => ({
  flex: {
    flex: 1
  },
  form: {
    textAlign: 'center'
  },
  formControl: {
    margin: theme.spacing.unit,
    width: 250
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  p: {
    marginBefore: '1em',
    marginAfter: '1em'
  },
  title: {
    fontWeight: 500,
    textAlign: 'center'
  },
  loadingDiv: {
    marginTop: 50
  }
});

const timeouts = [
  {
    value: 60,
    label: '1 minute'
  },
  {
    value: 5 * 60,
    label: '5 minutes'
  },
  {
    value: 15 * 60,
    label: '15 minutes'
  },
  {
    value: 30 * 60,
    label: '30 minutes'
  }
];

class StepModel extends React.Component {
  componentDidMount() {
    // const ta2TimeRunning = 60; // number of seconds ta2 is configured to run
    // this will cause the progress bar to increment such that it reaches 100% at timeout
    // this.timer = setInterval(this.progress, (1000 * ta2TimeRunning) / 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { pipelineProgress } = this.props;
    if (pipelineProgress < 100) {
      this.props.handleProgress(pipelineProgress + 1);
    }
  };

  render() {
    const {
      classes, ta2port, ta2timeout, pipelines, state, handleChange,
      handleTimeoutChange, handleClick, pipelineProgress
    } = this.props;

    return (
      <div>
        <Typography variant="headline" className={classes.title}>
          Modeling
        </Typography>
        <Typography className={classes.p}>
          Choose a modeling framework to use to train.
        </Typography>
        <form autoComplete="off" className={classes.form}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="model-input" />
            <Select
              value={ta2port}
              onChange={event => handleChange(event.target.value)}
              inputProps={{
                name: 'ta2model',
                id: 'model-input'
              }}
            >
              {ta2models.map(d => (
                <MenuItem key={`item-${d.name}`} value={d.port}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select a TA2 modeling framework
            </FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="model-timeout" />
            <Select
              value={ta2timeout}
              onChange={event => handleTimeoutChange(event.target.value)}
              inputProps={{
                name: 'ta2timeout',
                id: 'model-timeout'
              }}
            >
              {timeouts.map(d => (
                <MenuItem key={`item-${d.value}`} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              How long to train models
            </FormHelperText>
          </FormControl>
          {ta2port !== -1 ? (
            <Button
              variant="raised"
              color="primary"
              onClick={() => handleClick(ta2port, state)}
              disabled={pipelines.isFetching}
            >
              Train
            </Button>
          ) : ''}
          {pipelines.isFetching === true & pipelineProgress !== 100 ? (
            <div className={classes.loadingDiv}>
              <LinearProgress variant="determinate" value={pipelineProgress} />
              <br />
              <Typography>
                Running models...
              </Typography>
            </div>
          ) : ''}
          {pipelines.isFetching === true & pipelineProgress === 100 ? (
            <div className={classes.loadingDiv}>
              <LinearProgress variant="determinate" value={pipelineProgress} />
              <br />
              <Typography>
                Fetching results...
              </Typography>
            </div>
          ) : ''}
          {pipelines.isLoaded === true ? (
            <ModelTable data={pipelines.data} />
          ) : ''}
        </form>
      </div>
    );
  }
}

StepModel.propTypes = {
  classes: PropTypes.object.isRequired,
  ta2port: PropTypes.number.isRequired,
  ta2timeout: PropTypes.number.isRequired,
  pipelines: PropTypes.object.isRequired,
  pipelineProgress: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleTimeoutChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleProgress: PropTypes.func.isRequired
};

const mapStateToProps = state => (
  {
    ta2port: state.ta2port,
    ta2timeout: state.ta2timeout,
    pipelines: state.pipelines,
    pipelineProgress: state.pipelineProgress,
    state
  }
);

const mapDispatchToProps = dispatch => ({
  handleChange: (port) => {
    dispatch(setTA2Port(port));
  },
  handleTimeoutChange: (timeout) => {
    dispatch(setTA2Timeout(timeout));
  },
  handleClick: (port, state) => {
    dispatch(setPipelineProgress(0));
    this.timer = setInterval(this.progress, (1000 * state.ta2timeout) / 100);
    runTA2(port, dispatch, state);
  },
  handleProgress: (val) => {
    dispatch(setPipelineProgress(val));
    if (val === 100) {
      clearInterval(this.timer);
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StepModel));
