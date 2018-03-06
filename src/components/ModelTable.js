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

import ModelTableToolbar from './ModelTableToolbar';
import ModelTableHead from './ModelTableHead';
import { setSelectedPipelines, exportPipeline } from '../actions';

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

class ModelTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    const dat = props.data;

    const rocs = dat.map(d => d.pipelineInfo.scores[0].value);
    rocs.sort();
    const rocsMin = rocs[0];
    const rocsMax = rocs[rocs.length - 1];

    const tableDat = dat.map((d, i) => {
      const val = d.pipelineInfo.scores[0].value;
      const width = (((val - rocsMin) / (rocsMax - rocsMin)) * 50) + 50;

      return ({
        id: i,
        PIPELINE: d.pipelineId,
        F1_MACRO: d.pipelineInfo.scores[0].value,
        RANK: (<span className={props.classes.tableGraph} style={{ width }} />),
        EXPORT: (
          <Button
            size="small"
            color="primary"
            variant="raised"
            onClick={() => this.props.handleExport(d.pipelineId, this.props.state)}
          >
            Export
          </Button>)
      });
    });

    tableDat.sort((a, b) => (b.F1_MACRO < a.F1_MACRO ? -1 : 1));

    this.state = {
      order: 'desc',
      orderBy: 'F1_MACRO',
      data: tableDat,
      page: 0,
      rowsPerPage: 5
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.props.handleChange(this.state.data.map(n => n.id));
      return;
    }
    this.props.handleChange([]);
  };

  handleClick = (event, id) => {
    const selected = this.props.selectedPipelines;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => (
    this.setState({ rowsPerPage: event.target.value })
  );

  isSelected = id => this.props.selectedPipelines.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const {
      data, order, orderBy, rowsPerPage, page
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

    return (
      <Paper className={classes.root}>
        <ModelTableToolbar numSelected={this.props.selectedPipelines.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <ModelTableHead
              numSelected={this.props.selectedPipelines.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map((n) => {
                const isSelected = this.isSelected(n.id);
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, n.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    <TableCell padding="none">{n.PIPELINE}</TableCell>
                    <TableCell numeric>{n.F1_MACRO}</TableCell>
                    <TableCell>{n.RANK}</TableCell>
                    <TableCell>{n.EXPORT}</TableCell>
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

ModelTable.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedPipelines: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleExport: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

const mapStateToProps = state => (
  {
    selectedPipelines: state.selectedPipelines,
    state
  }
);

const mapDispatchToProps = dispatch => ({
  handleChange: (val) => {
    // console.log(val);
    dispatch(setSelectedPipelines(val));
  },
  handleExport: (pipelineId, state) => {
    exportPipeline(pipelineId, state);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ModelTable));
