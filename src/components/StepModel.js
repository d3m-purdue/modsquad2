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
import { setTA2Port, runTA2 } from '../actions';
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

const StepModel = ({
  classes, ta2port, pipelines, state, handleChange, handleClick
}) => (
  <div>
    <Typography variant="headline" className={classes.title}>
      Model Discovery
    </Typography>
    <Typography className={classes.p}>
      Choose an automated modeling framework to use below.  To do this, please select the arrove above where the interface says 'Select a TA2 modeling framework'.  You will then be presented with one or more options to choose from.  Please select a framework to use by clicking on its name, even if only one option is presented.  When it is highlighted in blue, please click the button marked 'TRAIN'.  This will tell the automated framework to train itself on the dataset and generate one or more candidate solutions to the problem you are studying.  
    </Typography>
    <Typography className={classes.p}>
      The automated training could take a few minutes, depending on size and complexity of the problem being estimated.  The automated framework will try several different approaches that predict the values of the target variable. If this process is successful, you will be presented with a table of ranked options to further explore below.  To explore the resulting predictions, select one or more rows of the table by clicking the box on the left side and then select the NEXT button at the bottom of the interface. Please feel free to go back and forth, selecting and reviewing different solutions until you have decided which one is the overall best.  To select the best one, click the button marked EXPORT to send this solution to be scored. Then you may proceed to the Quit panel and end the session. 
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
              {d.display}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select a TA2 modeling framework</FormHelperText>
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
          <LinearProgress />
          <br />
          <Typography>Running models. This may take a few minutes...</Typography>
        </div>
      ) : ''}
      {pipelines.isLoaded === true ? (
        <ModelTable data={pipelines.data} />
      ) : ''}
    </form>
  </div>
);

StepModel.propTypes = {
  classes: PropTypes.object.isRequired,
  ta2port: PropTypes.number.isRequired,
  pipelines: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
};

const mapStateToProps = state => (
  {
    ta2port: state.ta2port,
    pipelines: state.pipelines,
    state
  }
);

const mapDispatchToProps = dispatch => ({
  handleChange: (port) => {
    dispatch(setTA2Port(port));
  },
  handleClick: (port, state) => {
    runTA2(port, dispatch, state);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StepModel));
