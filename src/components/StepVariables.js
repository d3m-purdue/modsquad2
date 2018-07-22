import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
// import FormControlLabel from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import Histogram from './PlotHistogram';
import Barchart from './PlotBarchart';
import QQ from './PlotQQ';

import createTrelliscopeSpec from '../utils/trelliscope';
import { chipColors } from '../constants';
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
  muted: {
    color: '#aaaaaa'
  },
  listContainer: {
    borderRight: '1px solid #efefef',
    overflowY: 'auto',
    minWidth: 215
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

const StepVariables = ({
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
          Features in this Dataset
        </Typography>
        <Typography className={classes.p}>
          The dataset associated with this problem has a number of describing attributes or "features". Each one takes on
          multiple values, and may or may not be related to the values of of other features. For each feature, we examine
          the range of values it takes on using different plots depending on the type of the variable.
        </Typography>
        <Typography className={classes.p}>
          For numeric variables (<span className={classes.chip2} style={{ background: chipColors['real'] }}>real</span> and <span className={classes.chip2} style={{ background: chipColors['integer'] }}>integer</span>), a histogram is displayed which shows how often the feature value falls within a set of ranges. This plot gives insight on the "distribution" of the feature's values. A companion plot, called a "Quantile plot", is next. The Quantile plot displays ALL the values this features takes -- displaying the values in order, from smallest to largest.
        </Typography>
        <Typography className={classes.p}>
          For <span className={classes.chip2} style={{ background: chipColors['categorical'] }}>categorical</span> variables,
          a bar chart is displayed, which shows how frequently each value of the variable occurs in the data. If there are
          too many categories, only the top 15 will be shown.
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
      switchContent = (
        <Typography>
        Include this variable in the analysis
          <Switch
            checked={inactiveVars.indexOf(variable) === -1}
            onChange={() => handleSwitch(variable, inactiveVars)}
          />
        </Typography>
      );

      if (varType === 'integer' || varType === 'real') {
        content = (
          <div className={classes.numWrapper}>
            <div>
              <Typography variant="headline" className={classes.title2}>
                Histogram
              </Typography>
              <Histogram
                data={data}
                field={variable}
                width={310}
                height={300}
                // className={classes.numLeft}
              />
            </div>
            <div>
              <Typography variant="headline" className={classes.title2}>
                All Values Plot
              </Typography>
              <QQ
                data={data}
                field={variable}
                width={310}
                height={280}
                // className={classes.numRight}
              />
            </div>
            <div>
              <Tooltip
                id="tooltip-icon"
                title="The first plot is a histogram.  It shows the distribution of the values a variable takes on.  The histogram
                counts up the feature values and maps the heights of the bars according to how many samples were within each value range.
                The second plot is often called a quantile plot.  It shows every value this feature takes on in the dataset, ordered from smallest to largest.
                "
              >
                <IconButton aria-label="Help">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      } else if (varType === 'categorical') {
        content = (
          <div>
            <Typography variant="headline" className={classes.title2}>
              Bar Chart
            </Typography>
            <Barchart
              data={data}
              field={variable}
              width={620}
              height={300}
            />
          </div>
        );
      } else if (varType === 'string') {
        // check to see if it's an image
        if (data[0][variable].match('jpg$|png$') == null) {
          // this is a string but treat it like a categorical variable
          content = (
          <div>
            <Typography variant="headline" className={classes.title2}>
              Bar Chart
            </Typography>
            <Barchart
              data={data}
              field={variable}
              width={620}
              height={300}
            />
          </div>
        );
        } else {
          // createTrelliscopeSpec
          const newData = Object.assign([], [], data);
          for (let i = 0; i < newData.length; i += 1) {
            const fbase = newData[i][variable]; // .replace(/\.jpg$|\.png$/i, '');
            newData[i].image_url = `/image?mediafile=${fbase}`;
          }

          const config = createTrelliscopeSpec({
            data: newData,
            name: 'images',
            group: 'common',
            desc: '',
            height: 500,
            width: 500,
            nrow: 2,
            ncol: 3,
            panelCol: 'image_url',
            panelKey: variable,
            labels: [variable],
            // sort: [{ order: 1, name: variable, dir: 'asc' }],
            updated: '2018-02-08 04:43:24',
            keySig: 'f042c72d14c4433840ed7f529498be05'
          });

          content = (
            <div
              style={{ width: 720, height: window.innerHeight - 230, marginLeft: -30 }}
              ref={(input) => {
                // need to do some special things to append trelliscope
                // when it mounts, append trelliscope display
                // when it unmounts, destroy DOM node (since React isn't aware of it)
                if (input === null) { // this is unmounting
                  const el = document.getElementById('TRELLISCOPEWRAPPER');
                  if (el !== null) {
                    el.remove();
                  }
                } else {
                  const node = document.createElement('div');
                  node.id = 'TRELLISCOPEWRAPPER';
                  node.style = `width:720px;height:${window.innerHeight - 230}px;marginLeft:-30px`;
                  document.getElementById('trellisContainer').appendChild(node);
                  window.trelliscopeApp('TRELLISCOPEWRAPPER', config);
                }
              }}
              id="trellisContainer"
            />
          );
          // config.displayObj.state.sort[0].name = "image_file";
          // config.displayObj.cogInfo.image_file.defLabel = true;
          // config.displayObj.cogInfo.image_file.desc = "conditioning variable";
          // trelliscopeApp('asdf', config);
        }
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
                    <span className={inactiveVars.indexOf(d.colName) > -1 ? classes.muted : ''}>
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
        {switchContent}
      </div>
    </div>
  );
};

StepVariables.propTypes = {
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
)(withStyles(styles)(StepVariables));
