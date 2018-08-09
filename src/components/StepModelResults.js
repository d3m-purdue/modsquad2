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

import { setActiveResultId } from '../actions';


const determineProblemType = (metric) => {
  const classificationMetrics = ['accuracy', 'f1Macro', 'f1Micro', 'ROC_AUC', 'rocAuc', 'rocAucMicro', 'rocAucMacro'];
  if (classificationMetrics.indexOf(metric) > -1) {
    return 'classification';
  }
  return 'regression';
};


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

const StepModelResults = ({
  classes, data, pdata, meta, problems, selected, pipelines, selectedPipelines, handleChange,
}) => {
  if (pdata.isFetching === true) {
    return (
      <div className={classes.loadingDiv}>
        <LinearProgress />
        <br />
        <Typography>
          Getting model predictions...
        </Typography>
      </div>
    );
  }

  if (pdata.isLoaded === false) {
    return (
      <Typography>
        Please select pipeline results from the previous step.
      </Typography>
    );
  }

  let dat;
  let yvar;
  let sel = selected;
  if (sel === '') {
    sel = selectedPipelines[0];
  }

  if (pdata && pdata.data) {
    const allIds = pdata.data.map(d => d.pipeline.solution_id);
    const idx = allIds.indexOf(sel);

    // if (!(pdata.data[idx] && pdata.data[idx].data)) {
    //   return (
    //     <Typography>
    //       We had trouble processing the results from this solution attempt. Please try a different solution candidate.
    //     </Typography>
    //   );
    // }
    if (idx === -1) {
      return (
        <Typography>
          We had trouble processing the results from this solution attempt. Please try a different solution candidate.
        </Typography>
      );
    }

debugger;
    dat = pdata.data[idx].data;
    yvar = problems[0].targets[0].colName;

    const datLookup = {};
    if (dat) {
      dat.forEach((a) => {
        datLookup[a.d3mIndex] = [a[yvar]];
      });
    }

    let plots = '';
    let helperText = '';

    if (determineProblemType(problems[0].metrics[0].metric) === 'classification') {
      const uYVar = [];
      const newData = [];
      for (let i = 0; i < data.length; i += 1) {
        // for some reason 'data' doesn't have 'd3mIndex' (why?) so treat 'i' as index
        const tmp = {
          Predicted: datLookup[data[i].d3mIndex]
        };
        tmp[yvar] = data[i][yvar];
        newData.push(tmp);
        // data[i].Predicted = datLookup[data[i].d3mIndex];
        if (uYVar.indexOf(data[i][yvar]) === -1) {
          uYVar.push(data[i][yvar]);
        }
      }
      uYVar.sort();

      helperText = (
        <div>
          <Typography className={classes.p}>
            The prediction algorithm returns a set of predicted values. To help assess how the algorithm has performed with 
            respect to the target variable, we display a heatmap showing, for each possible value of the observed target variable, 
            the proportion of times the prediction fell into each possible value. See the possible values along the vertical axes on the left. 
            The actual target variable values are arranged along the bottom axis.  Each vertical column for a particular value
            of the target variable represents the values the modeling engine predicted for the particular target variable value.  Looking at the legend on the right
            shows how the different prediction values are distributed.  
          
          </Typography>
          <Typography className={classes.p}>
            This visualization helps to assess whether there are certain values of the target variable that are predicted better than other values. If the model is doing well for all values of the target variable,
            a brighter diagonal pattern from the top left to the bottom right should be present in the heatmap. Each value the target variable takes on
            is listed along the bottom of the heatmap.  Any white regions on the chart correspond to predicted values that never occurred.
          </Typography>
          <Typography className={classes.p}>
           When you have decided which solution is the best, please don't forget to go back to the previous step and hit EXPORT on the proper solution.
          </Typography>
        </div>
      );

      plots = (
        <CatHeatmap
          data={newData}
          xField={yvar}
          yField="Predicted"
          width={550}
          height={400}
          xDomain={uYVar}
          yDomain={uYVar}
          normCols
          normRows={false}
        />
      );
    } else if (determineProblemType(problems[0].metrics[0].metric) === 'regression') {
      // construct a lookup table by id so we can correctly merge with our data
      for (let i = 0; i < data.length; i += 1) {
        // for some reason 'data' doesn't have 'd3mIndex' (why?) so treat 'i' as index
        data[i].Predicted = parseFloat(datLookup[data[i].d3mIndex]);
        data[i].Residual = parseFloat(data[i][yvar]) - data[i].Predicted;
      }

      helperText = (
        <div>
          <Typography className={classes.p}>
           The model engine returns a set of predicted values, from which we can compute residuals, which are the actual
           observed values subtracted from the predicted values. If a model fits well, the residuals should visually
           not exhibit any kind of pattern, and should appear as random noise.
          </Typography>
          <Typography className={classes.p}>
          It is useful to visualize the residuals vs. the predicted values and also vs. all of the other variables
          in the data to look for patterns. In all of these plots, the residuals should vary randomly around zero.
          </Typography>
        </div>
      );

      plots = (
        <div>
          {meta.slice(1).map((d) => {
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

    const allPIds = pipelines.data.map(d => d.solutionId);

    return (
      <div className={classes.root}>
        <Typography variant="headline" className={classes.title}>
          Investigate Model Output
        </Typography>
        {helperText}
        <form autoComplete="off" className={classes.form}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="variable-input">Candidate Solution</InputLabel>
            <Select
              value={sel}
              onChange={event => handleChange(event.target.value)}
              inputProps={{
                name: 'pipeline',
                id: 'pipeline-input'
              }}
            >
              {selectedPipelines.map((d, i) => (
                <MenuItem key={`item-${i}`} value={d}>
                  {pipelines.data[allPIds.indexOf(d)].solutionId}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select a solution result to visualize
            </FormHelperText>
          </FormControl>
        </form>
        <div className={classes.plotContainer}>
          {plots}
        </div>
      </div>
    );
  } else {
    console.log('data returned from model was empty?');
    return (
      <Typography>
      We had trouble processing the results from this solution attempt.  Please try a different solution candidate.
      </Typography>
    );
  }
};

StepModelResults.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  meta: PropTypes.array.isRequired,
  pdata: PropTypes.object.isRequired,
  problems: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  pipelines: PropTypes.object.isRequired,
  selectedPipelines: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired
};

const mapStateToProps = state => (
  {
    data: state.activeData.data,
    pdata: state.executedPipelines,
    meta: state.metadata.data,
    problems: state.problems.data,
    selected: state.activeResultIndex,
    pipelines: state.pipelines,
    selectedPipelines: state.selectedPipelines
  }
);

const mapDispatchToProps = dispatch => ({
  handleChange: (val) => {
    dispatch(setActiveResultId(val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StepModelResults));
