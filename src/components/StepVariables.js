import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Histogram from './PlotHistogram';
import Barchart from './PlotBarchart';
import QQ from './PlotQQ';

import { chipColors } from '../constants';
import { setVariableVar } from '../actions';

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    position: 'absolute',
    top: 0,
    bottom: 0,
    maxWidth: 900,
    overflow: 'hidden'
  },
  panelHead: {
    background: '#f5f5f5'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 500
  },
  chip: {
    color: 'white',
    borderRadius: 14,
    fontSize: 11,
    fontWeight: 500,
    paddingTop: 1,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 10,
    opacity: 0.6
  },
  chip2: {
    color: 'white',
    borderRadius: 14,
    fontSize: 13,
    fontWeight: 500,
    paddingTop: 1,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    opacity: 0.4
  },
  listContainer: {
    borderRight: '1px solid #efefef',
    overflowY: 'auto',
    minWidth: 215,
  },
  contentContainer: {
    // width: 'calc(100% - 255px)',
    paddingLeft: 30,
    overflowY: 'auto',
    width: '100%'
  },
  p: {
    marginBefore: '1em',
    marginAfter: '1em'
  },
  title: {
    fontWeight: 500,
    textAlign: 'center'
  },
  title2: {
    marginTop: 20,
    fontWeight: 500,
    textAlign: 'center',
    fontSize: 20
  },
  numWrapper: {
    textAlign: 'center'
    // width: '100%'
    // display: 'flex'
  },
  numLeft: {
    flex: '0 0 65%'
  },
  numRight: {
    flex: 1
  },
  selected: {
    background: '#efefef'
  }
});

const StepVariables = ({ classes, data, meta, variable, handleClick }) => {
  if (data.length === 0 || meta.length === 0) {
    // TODO: loading indicator
  }
  let content = '';
  if (variable === '__info__') {
    content = (
      <div>
        <Typography variant="headline" className={classes.title}>
          Features in this Problem
        </Typography>
        <Typography className={classes.p}>
          This dataset has a number of describing attributes or "features". Each one takes on multiple values, and may or may not be related to the values of of other features. For each feature, we examine the range of values it takes on using different plots depending on the type of the variable.
        </Typography>
        <Typography className={classes.p}>
          For numeric variables (<span className={classes.chip2} style={{ background: chipColors['real'] }}>real</span> and <span className={classes.chip2} style={{ background: chipColors['integer'] }}>integer</span>), a histogram is displayed which shows how often the feature value falls within a set of ranges. This plot gives insight on the "distribution" of the feature's values. A companion plot is displayed which is called a "normal probability plot". If the values of the feature follow a bell-shaped (or normal) distribution, the plot for this variable will be a straight line.
        </Typography>
        <Typography className={classes.p}>
          For <span className={classes.chip2} style={{ background: chipColors['categorical'] }}>categorical</span> variables, a bar chart is displayed, which shows how frequently each value of the variable occurs in the data. If there are too many categories, only the top 15 will be shown.
        </Typography>
        <Typography className={classes.p}>
          Click on a feature name to the left to view the plots for the feature.
        </Typography>
      </div>
    );
  } else {
    let varType = '';
    for (let i = 0; i < meta.length; i += 1) {
      if (meta[i].colName === variable) {
        varType = meta[i].colType;
        break;
      }
    }
    if (varType !== '') {
      if (varType === 'integer' || varType === 'real') {
        content = (
          <div className={classes.numWrapper}>
            <Typography variant="headline" className={classes.title2}>
              Histogram
            </Typography>
            <Histogram
              data={data}
              field={variable}
              width={350}
              height={300}
              // className={classes.numLeft}
            />
            <Typography variant="headline" className={classes.title2}>
              Normal Quantile Plot
            </Typography>
            <QQ
              data={data}
              field={variable}
              width={350}
              height={280}
              // className={classes.numRight}
            />
          </div>
        );
      } else {
        content = (
          <div>
            <Typography variant="headline" className={classes.title2}>
              Bar Chart
            </Typography>
            <Barchart
              data={data}
              field={variable}
              width={650}
              height={300}
            />
          </div>
        );
      }
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.listContainer}>
        <List component="nav" className={classes.list}>
          <ListItem
            button
            className={variable === '__info__' ? classes.selected : ''}
            onClick={() => handleClick('__info__')}
          >
            <ListItemText primary={<span className={classes.title}>Features</span>} />
          </ListItem>
          {meta.slice(1).map((d) => {
            return (
              <ListItem
                key={`li-${d.colName}`}
                button
                className={variable === d.colName ? classes.selected : ''}
                onClick={() => handleClick(d.colName)}
              >
                <ListItemText
                  primary={
                    <span>
                      {d.colName}
                      <span className={classes.chip} style={{ background: chipColors[d.colType] }}>
                        {d.colType}
                      </span>
                    </span>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </div>
      <div className={classes.contentContainer}>
        {content}
      </div>
    </div>
  );
};

StepVariables.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  meta: PropTypes.array.isRequired,
  variable: PropTypes.string.isRequired
};

const mapStateToProps = state => (
  {
    data: state.activeData.data,
    meta: state.metadata.data,
    variable: state.variableVar
  }
);

const mapDispatchToProps = dispatch => ({
  handleClick: (val) => {
    dispatch(setVariableVar(val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StepVariables));
