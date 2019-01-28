import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';

import DatasetTableToolbar from './DatasetTableToolbar';
import DatasetTableHead from './DatasetTableHead';
import { setSelectedExternalDatasets, augmentDataset } from '../actions';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  tableGraph: {
    display: 'inline-block',
    height: 20,
    background: '#448aff'
  }
});

class DatasetTable extends React.Component {
  constructor(props, context) {
    super(props, context);


    const tableDat = this.props.data.map((d, i) => {
      const val = d.name;
  

      let btn = '';
      console.log(d.assetstoreId);
      // TODO: this not doing what we want... keep track of state if it has been run, just like export
      const expIdx = this.props.data.indexOf(d.assetstoreId);
      if (expIdx > -1) {
        btn = (
          <span>
            Augmented
            <br />
            (rank {expIdx + 1})
          </span>
        );
      } else {
        btn = (
          <Button
            size="small"
            color="primary"
            variant="raised"
            onClick={() => this.handleDataMart(d.assetstoreId)}
          >
            Augment with DataMart
          </Button>
        );
      }

      // declare the record columns here for the dataset. Needs to match DataTableHead declarations
      return ({
        id: i,
        DATASET: d.assetstoreId,
        NAME: d.name,
        AUGMENT: btn
      });
    });

    // the state stored by the datatable.  

    this.state = {
      data: tableDat,
      page: 0,
      rowsPerPage: 5
    };
  }

  
  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.props.handleChange(this.state.data.map(n => n.NAME));
      return;
    }
    this.props.handleChange([]);
  };

  handleClick = (event, assetstoreId) => {
    const selected = this.props.selectedExternalDatasets;
    const selectedIndex = selected.indexOf(assetstoreId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, assetstoreId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.props.handleChange(newSelected);
  };

  /*
  handleDataMart = (assetstoreId) => {
    this.props.handleDataMart(assetstoreId, this.props.data)
    const newTableDat = Object.assign([], this.state.datasets);
    const sids = newTableDat.map(d => d.DATASET);
  }
*/
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => (
    this.setState({ rowsPerPage: event.target.value })
  );

  isSelected = pid => this.props.data.indexOf(pid) !== -1;

  render() {
    const { classes } = this.props;
    const {
      data, order, orderBy, rowsPerPage, page
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

    return (
      <Paper className={classes.root}>
        <DatasetTableToolbar numSelected={this.props.data.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <DatasetTableHead
              numSelected={this.props.data.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map((n) => {
                const isSelected = this.isSelected(n.PIPELINE);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onClick={event => this.handleClick(event, n.DATASET)}
                      />
                    </TableCell>
                    <TableCell padding="none">{n.DATASET}</TableCell>
                    <TableCell >{n.NAME}</TableCell>
                    <TableCell>{n.AUGMENT}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={5}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page'
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page'
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

DatasetTable.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleAugment: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  selectExternalData: PropTypes.object.isRequired
};

const mapStateToProps = state => (
  {
    data: state.externalData.data,
    selectedExternalDatasets: state.selectedExternalDatasets
  }
);

const mapDispatchToProps = dispatch => ({
  handleChange: (val) => {
    console.log(val);
    dispatch(setSelectedExternalDatasets(val));
  },

  handleAugment: (dataId, externalData, state) => {
    //selectExternalData(dataId, state);
    const eds = Object.assign([], externalData);
    eds.push(dataId);
    //dispatch(setExternalData(eds));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DatasetTable));
