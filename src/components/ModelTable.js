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
import { setSelectedPipelines } from '../actions';

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

    // const dat = [{"progressInfo":"COMPLETED","pipelineId":"L867B8NJITYP87EO01QP","responseInfo":{"status":{"code":"OK","details":"Completed pipeline L867B8NJITYP87EO01QP; cv score: 0.933, 0.008"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/L867B8NJITYP87EO01QP-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9329187273979187}]}},{"progressInfo":"COMPLETED","pipelineId":"U7C2IUY7BFNA20CKO2G2","responseInfo":{"status":{"code":"OK","details":"Completed pipeline U7C2IUY7BFNA20CKO2G2; cv score: 0.927, 0.004"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/U7C2IUY7BFNA20CKO2G2-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9273164868354797}]}},{"progressInfo":"COMPLETED","pipelineId":"I6VLZP7GW5DZ4OTFWVOP","responseInfo":{"status":{"code":"OK","details":"Completed pipeline I6VLZP7GW5DZ4OTFWVOP; cv score: 0.932, 0.009"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/I6VLZP7GW5DZ4OTFWVOP-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9319902658462524}]}},{"progressInfo":"COMPLETED","pipelineId":"3J5D0E85N4UR4OVKPYCY","responseInfo":{"status":{"code":"OK","details":"Completed pipeline 3J5D0E85N4UR4OVKPYCY; cv score: 0.935, 0.008"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/3J5D0E85N4UR4OVKPYCY-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9347809553146362}]}},{"progressInfo":"COMPLETED","pipelineId":"0CUCVAZME1HJ8DMHKFZ4","responseInfo":{"status":{"code":"OK","details":"Completed pipeline 0CUCVAZME1HJ8DMHKFZ4; cv score: 0.935, 0.007"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/0CUCVAZME1HJ8DMHKFZ4-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9347809553146362}]}},{"progressInfo":"COMPLETED","pipelineId":"CL6KFA1MPHR550PSNN1K","responseInfo":{"status":{"code":"OK","details":"Completed pipeline CL6KFA1MPHR550PSNN1K; cv score: 0.931, 0.007"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/CL6KFA1MPHR550PSNN1K-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9310513138771057}]}},{"progressInfo":"COMPLETED","pipelineId":"VHHZBL1OAQOV5ZLACPAE","responseInfo":{"status":{"code":"OK","details":"Completed pipeline VHHZBL1OAQOV5ZLACPAE; cv score: 0.934, 0.005"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/VHHZBL1OAQOV5ZLACPAE-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9338420629501343}]}},{"progressInfo":"COMPLETED","pipelineId":"UD4BVJYPCCCY3ICOTN0A","responseInfo":{"status":{"code":"OK","details":"Completed pipeline UD4BVJYPCCCY3ICOTN0A; cv score: 0.933, 0.008"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/UD4BVJYPCCCY3ICOTN0A-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9329187273979187}]}},{"progressInfo":"COMPLETED","pipelineId":"F5V02ZPFJ94348LE9L3Z","responseInfo":{"status":{"code":"OK","details":"Completed pipeline F5V02ZPFJ94348LE9L3Z; cv score: 0.931, 0.007"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/F5V02ZPFJ94348LE9L3Z-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9310513138771057}]}},{"progressInfo":"COMPLETED","pipelineId":"COQ9RD4UQE6BHHWEY9A8","responseInfo":{"status":{"code":"OK","details":"Completed pipeline COQ9RD4UQE6BHHWEY9A8; cv score: 0.934, 0.006"}},"pipelineInfo":{"predictResultUri":"file:///writable/temp/COQ9RD4UQE6BHHWEY9A8-train_preds.csv","scores":[{"metric":"ROC_AUC","value":0.9338420629501343}]}}];

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
        ROC_AUC: d.pipelineInfo.scores[0].value,
        RANK: (<span className={props.classes.tableGraph} style={{ width }} />),
        EXPORT: (
          <Button size="small" color="primary" variant="raised">
            Export
          </Button>)
      });
    });

    tableDat.sort((a, b) => (b.ROC_AUC < a.ROC_AUC ? -1 : 1));

    this.state = {
      order: 'desc',
      orderBy: 'ROC_AUC',
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
                    <TableCell numeric>{n.ROC_AUC}</TableCell>
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
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

const mapStateToProps = state => (
  {
    selectedPipelines: state.selectedPipelines
  }
);

const mapDispatchToProps = dispatch => ({
  handleChange: (val) => {
    console.log(val);
    dispatch(setSelectedPipelines(val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ModelTable));
