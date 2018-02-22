import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';

import Scatter from './PlotScatter';
import BoxPlot from './PlotBox';
import CatHeatmap from './PlotCatHeatmap';
import { setExploratoryYVar } from '../actions';

import { chipColors } from '../constants';

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
    marginTop: 20,
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
  }
});

const StepExploratory = ({
  classes, data, meta, problems, yvar, handleChange
}) => {
  if (data.length === 0 || meta.length === 0 || problems.length === 0) {
    // TODO: loading indicator
    return ('');
  }

  let yvarType = '';
  for (let i = 0; i < meta.length; i += 1) {
    if (meta[i].colName === yvar) {
      yvarType = meta[i].colType;
      break;
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="headline" className={classes.title}>
        Compare the Target Feature Against All Others
      </Typography>
      <Typography className={classes.p}>
        This portion of the interface explores the target feature against all other features simultaneously. A plot is generated with the target feature values along the Y axis and one of the other features in the dataset on each X axis -- showing whether any features are related to the target feature or not.
      </Typography>
      <Typography className={classes.p}>
        If the points appear to be randomly arranged, as a cloud of dots, the feature variable is not strongly correlated with the target variable. If the points are visually tightly grouped around some pattern (such as a line or curve), then there is a relationship between the two variables.
      </Typography>
      <Typography className={classes.p}>
        Select the target variable below to generate the plots. Note that the suggested target variable for this problem is pre-selected and is marked with the color red in the dropdown list.
      </Typography>
      <form autoComplete="off" className={classes.form}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="variable-input">Variable</InputLabel>
          <Select
            value={yvar}
            onChange={event => handleChange(event.target.value)}
            inputProps={{
              name: 'variable',
              id: 'variable-input'
            }}
          >
            {meta.slice(1).map((d) => {
              let itemStyle = {};
              if (d.colName === problems[0].targets[0].colName) {
                itemStyle = { background: 'rgba(255, 0, 0, 0.5)' };
              }
              return (
                <MenuItem key={`item-${d.colName}`} value={d.colName} style={itemStyle}>
                  {d.colName}
                  <span className={classes.chip} style={{ background: chipColors[d.colType] }}>
                    {d.colType}
                  </span>
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>Select a target (y-axis) variable</FormHelperText>
        </FormControl>
      </form>
      <div>
        {meta.slice(1).map((d) => {
          if (d.colName === yvar) {
            return ('');
          }
          let content = '';
          let content2 = '';
          if (yvarType === 'real' || yvarType === 'integer') {
            if (d.colType === 'real' || d.colType === 'integer') {
              content = (
                <Scatter
                  data={data}
                  xField={d.colName}
                  yField={yvar}
                  width={600}
                  height={400}
                />
              );
            } else if (d.colType === 'categorical') {
              content = (
                <BoxPlot
                  data={data}
                  xField={d.colName}
                  yField={yvar}
                  yCat={false}
                  width={600}
                  height={400}
                />
              );
            }
          } else if (yvarType === 'categorical') {
            if (d.colType === 'real' || d.colType === 'integer') {
              content = (
                <BoxPlot
                  data={data}
                  xField={d.colName}
                  yField={yvar}
                  yCat
                  width={600}
                  height={400}
                />
              );
            } else if (d.colType === 'categorical') {
              content = (
                <CatHeatmap
                  data={data}
                  xField={d.colName}
                  yField={yvar}
                  width={550}
                  height={400}
                  normCols={false}
                  normRows={false}
                />
              );
            }
          }
          // console.log(content.props)
          // if the plot returned '', don't have a header
          if (typeof content !== 'string') {
            content2 = (
              <div>
                <Typography variant="headline" className={classes.title}>
                  {d.colName}
                </Typography>
                {content}
              </div>
            );
          }
          return (
            <div key={`container-${d.colName}`} className={classes.plotContainer}>
              {content2}
            </div>
          );
        })}
      </div>
    </div>
  );
};

StepExploratory.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  meta: PropTypes.array.isRequired,
  problems: PropTypes.array.isRequired,
  yvar: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
};

const mapStateToProps = state => (
  {
    data: state.activeData.data,
    meta: state.metadata.data,
    problems: state.problems.data,
    yvar: state.exploreYVar
  }
);

const mapDispatchToProps = dispatch => ({
  handleChange: (val) => {
    dispatch(setExploratoryYVar(val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StepExploratory));
