import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import DatasetTable from './DatasetTable'
import { setVariableVar, setInactiveVariables } from '../actions';

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    position: 'absolute',
    top: 0,
    bottom: 0,
    maxWidth: 1000,
    overflow: 'hidden'
  },
  panelHead: {
    background: '#f5f5f5'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 500
  },
  
  muted: {
    color: '#aaaaaa'
  },
  listContainer: {
    borderRight: '1px solid #efefef',
    overflowY: 'auto',
    minWidth: 0
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
    // display: 'inline-block',
    textAlign: 'center',
    // width: '100%'
    display: 'flex'
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

var datasetList = ['one','two']

const StepDatasets = ({
  classes, data, meta, variable, inactiveVars, handleSwitch, handleClick
}) => {
  if (data.length === 0 || meta.length === 0) {
    // TODO: loading indicator
  }
  let content = '';
  let switchContent = '';
  if (variable === '__info__') {
    content = (
      <div>
        <Typography variant="headline" className={classes.title}>
          Datasets Available for Exploration
        </Typography>
        <Typography className={classes.p}>
          Datasets already loaded in the system are displayed in the table below.  In this panel, you can 
          select a dataset to work with or combine two tabular datasets into a new single, larger one.  
        </Typography>
        <Typography>
          When combining two datasets, this is accomplished by either joining the tables "side by side" so the resulting dataset
          has more columns together (this requires a common column) or (if the columns are the same), the second
          dataset can be added as additional rows on the "bottom" of the first table. 
        </Typography>
        <Typography className={classes.p}>
          The next panel is about selecting or identifying a problem to solve based on a dataset. Some 
          predefined problems are already loaded.   If you want to build a new problem around one of these
          datasets, please select it in the table before moving onto the next panel.  
        </Typography>

        <DatasetTable data={datasetList.data} />
          
      </div>
    );
  } else {
    let varType = '';
    let targetIdx = -1;
    for (let i = 0; i < meta.length; i += 1) {
      if (meta[i].colName === variable) {
        varType = meta[i].colType;
        targetIdx = meta[i].role.indexOf('suggestedTarget');
        break;
      }
    }
  }
    return (
      <div className={classes.root}>
        <div className={classes.listContainer}>
         
        </div>
        <div className={classes.contentContainer}>
          {content}
          {switchContent}
        </div>
      </div>
    );
  };

StepDatasets.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  meta: PropTypes.array.isRequired,
  variable: PropTypes.string.isRequired,
  inactiveVars: PropTypes.array.isRequired,
  handleSwitch: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
};

const mapStateToProps = state => (
  {
    data: state.activeData.data,
    meta: state.metadata.data,
    variable: state.variableVar,
    inactiveVars: state.inactiveVariables
  }
);

const mapDispatchToProps = dispatch => ({
  handleClick: (val) => {
    dispatch(setVariableVar(val));
  },
  handleSwitch: (variable, inactiveVars) => {
    const idx = inactiveVars.indexOf(variable);
    if (idx === -1) {
      inactiveVars.push(variable);
    } else {
      inactiveVars.splice(idx, 1);
    }
    dispatch(setInactiveVariables(inactiveVars));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StepDatasets));
