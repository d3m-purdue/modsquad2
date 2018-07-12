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
import { setTA2Port, runTA2, setPipelineProgress } from '../actions';
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

class StepModel extends React.Component {
  componentDidMount() {
    const ta2TimeRunning = 60; // number of seconds ta2 is configured to run
    // this will cause the progress bar to increment such that it reaches
    this.timer = setInterval(this.progress, (1000 * ta2TimeRunning) / 100);
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
      classes, ta2port, pipelines, state, handleChange, handleClick, pipelineProgress
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
          {pipelines.isFetching === true ? (
            <div className={classes.loadingDiv}>
              <LinearProgress variant="determinate" value={pipelineProgress} />
              <br />
              <Typography>
                Running models...
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
  pipelines: PropTypes.object.isRequired,
  pipelineProgress: PropTypes.number.isRequired,
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleProgress: PropTypes.func.isRequired
};

const mapStateToProps = state => (
  {
    ta2port: state.ta2port,
    pipelines: state.pipelines,
    pipelineProgress: state.pipelineProgress,
    state
  }
);

const mapDispatchToProps = dispatch => ({
  handleChange: (port) => {
    dispatch(setTA2Port(port));
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
