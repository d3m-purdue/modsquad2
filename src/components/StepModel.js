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
    value: 2 * 60,
    label: '2 minutes'
  },
  {
    value: 3 * 60,
    label: '3 minutes'
  },
  {
    value: 5 * 60,
    label: '5 minutes'
  }
];

class StepModel extends React.Component {
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.pipelines.isFetching & !prevProps.pipelines.isFetching) {
      this.timer = setInterval(this.progress, (1000 * this.props.ta2timeout) / 100);
    }

    if (this.props.pipelineProgress === 100) {
      clearInterval(this.timer);
    }

    // make sure to clearInterval if there was a failure in calling the service
    if (!this.props.pipelines.isFetching & prevProps.pipelines.isFetching & !this.props.pipelines.loaded) {
      clearInterval(this.timer);
    }
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
          Model Discovery
        </Typography>
        <Typography className={classes.p}>
          Choose a modeling engine to use below.  To do this, please select the arrove above where the interface says
           'Select a modeling engine'.  You will then be presented with one or more options to choose from.
           Please select an engine to use by clicking on its name, even if only one engine option is presented.
           When the TRAIN button becomes highlighted in blue, please click it to begin the training process.
           This will tell the modeling engine to train itself on the dataset and generate one or more candidate solutions
           to the problem you are studying.
        </Typography>
        <Typography className={classes.p}>
        The automated training could take a few minutes, depending on size and complexity of the problem being estimated.
        The modeling engine will try several different approaches that predict the values of the target variable.
        If this process is successful, you will be presented with a table of ranked options to further explore below.
        To explore the resulting predictions, select one or more rows of the table by clicking the box on the left of the
        row and then select the NEXT button at the bottom of the interface.
        </Typography>
        <Typography className={classes.p}>
        Please feel free to go back and forth,
        selecting and reviewing different solutions until you have settled on a few of the overall best proposed solutions.
        When you are ready to indicate your selections of the  best candidates, click the button marked
        EXPORT for each of your best solutions in order: with the best Exported first, then the second best, continuing
        until you have selected at least the best three to be scored. After selection is complete, your job is finished! Please proceed to the Quit
         panel and end your session.
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
              Select a modeling engine
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
                {`Running models (${pipelineProgress}%, ${Math.floor(10 * (1 - (pipelineProgress / 100)) * ta2timeout / 60) / 10} minutes remaining)...`}
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
    runTA2(port, dispatch, state);
  },
  handleProgress: (val) => {
    dispatch(setPipelineProgress(val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StepModel));
