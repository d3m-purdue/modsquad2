import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';

import Scatter from './PlotScatter';
import BoxPlot from './PlotBox';
import CatHeatmap from './PlotCatHeatmap';

const styles = theme => ({
  root: {
    width: '100%'
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
  plotContainer: {
    marginTop: 40,
    textAlign: 'center'
  },
  chip: {
    color: 'white',
    borderRadius: 14,
    fontSize: 10,
    lineHeight: '13px',
    fontWeight: 500,
    paddingTop: 1,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 10,
    opacity: 0.5
  },
  loadingDiv: {
    marginTop: 50
  }
});

class StepModelResults extends React.Component {
  state = {
    selected: 0
  };

  handleSelect = (event) => {
    this.setState({
      selected: event.target.value
    });
  };

  render() {
    const {
      classes, data, pdata, problems
    } = this.props;

    if (pdata.isFetching === true) {
      return (
        <div className={classes.loadingDiv}>
          <LinearProgress />
          <br />
          <Typography>Getting model predictions...</Typography>
        </div>
      );
    }

    if (pdata.isLoaded === false) {
      return (
        <Typography>Please select pipeline results from the previous step.</Typography>
      );
    }

    const dat = pdata.data[this.state.selected].data;
    const yvar = problems[0].targets[0].colName;

    const datLookup = {};
    dat.forEach((a) => {
      datLookup[a.d3mIndex] = [a[yvar]];
    });

    let plots = '';
    let helperText = '';

    if (problems[0].taskType === 'classification') {
      for (let i = 0; i < data.length; i += 1) {
        // for some reason 'data' doesn't have 'd3mIndex' (why?) so treat 'i' as index
        data[i].Predicted = parseFloat(datLookup[i]);
      }

      helperText = (
        <div>
          <Typography className={classes.p}>
            The prediction algorithm returns a set of predicted values. To help assess how the algorithm has performed with respect to the target variable, we can view a heatmap showing, for each possible value of the observed target variable, the proportion of times the prediction fell into each possible value.
          </Typography>
          <Typography className={classes.p}>
            This visualization helps to assess whether there are certain values of the target variable that are predicted better than other values. If the model is doing well for all values of the target variable, a heavy diagonal pattern should be present in the heatmap.
          </Typography>
        </div>
      );

      plots = (
        <CatHeatmap
          data={data}
          xField={yvar}
          yField="Predicted"
          width={550}
          height={400}
          normCols
          normRows={false}
        />
      );
    } else if (problems[0].taskType === 'regression') {
      // construct a lookup table by id so we can correctly merge with our data
      for (let i = 0; i < data.length; i += 1) {
        // for some reason 'data' doesn't have 'd3mIndex' (why?) so treat 'i' as index
        data[i].Predicted = parseFloat(datLookup[i]);
        data[i].Residual = parseFloat(data[i][yvar]) - data[i].Predicted;
      }

      helperText = (
        <div>
          <Typography className={classes.p}>
            The prediction algorithm returns a set of predicted values, from which we can compute residuals, which are the actual observed values subtracted from the predicted values. If a model fits well, the residuals should visually not exhibit any kind of pattern, and should appear as random noise.
          </Typography>
          <Typography className={classes.p}>
          It is useful to visualize the residuals vs. the predicted values and also vs. all of the other variables in the data to look for patterns. In all of these plots, the residuals should vary randomly around zero.
          </Typography>
        </div>
      );

      plots = (
        <div>
          {this.props.meta.slice(1).map((d) => {
            let content = '';
            if (d.colType === 'real' || d.colType === 'integer') {
              content = (
                <Scatter
                  data={data}
                  xField={d.colName}
                  yField="Residual"
                  width={600}
                  height={400}
                />
              );
            } else if (d.colType === 'categorical') {
              content = (
                <BoxPlot
                  data={data}
                  xField={d.colName}
                  yField="Residual"
                  yCat={false}
                  width={600}
                  height={400}
                />
              );
            }
            return (
              <div className={classes.plotContainer}>
                <Typography variant="headline" className={classes.title}>
                  {d.colName}
                </Typography>
                {content}
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <Typography>
          We currently only support model result visualization methods for regression and classification tasks.
        </Typography>
      );
    }

    return (
      <div className={classes.root}>
        <Typography variant="headline" className={classes.title}>
          Investigate Model Output
        </Typography>
        {helperText}
        <form autoComplete="off" className={classes.form}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="variable-input">Pipeline</InputLabel>
            <Select
              value={this.state.selected}
              onChange={this.handleSelect}
              inputProps={{
                name: 'pipeline',
                id: 'pipeline-input'
              }}
            >
              {pdata.data.map((d, i) => (
                <MenuItem key={`item-${d.pipeline.pipelineId}`} value={i}>
                  {d.pipeline.pipelineId}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select a pipeline result to visualize</FormHelperText>
          </FormControl>
        </form>
        <div className={classes.plotContainer}>
          {plots}
        </div>
      </div>
    );
  }
}

StepModelResults.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  meta: PropTypes.array.isRequired,
  pdata: PropTypes.object.isRequired,
  problems: PropTypes.array.isRequired
};

const mapStateToProps = state => (
  {
    data: state.activeData.data,
    pdata: state.executedPipelines,
    meta: state.metadata.data,
    problems: state.problems.data
  }
);

export default connect(
  mapStateToProps,
)(withStyles(styles)(StepModelResults));
