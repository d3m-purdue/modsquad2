import React from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';

const styles = {
  header: {
    fontWeight: 600
  }
};

const columnData = [
  {
    id: 'PIPELINE',
    numeric: false,
    disablePadding: true,
    label: 'PIPELINE'
  },
  {
    id: 'ROC_AUC',
    numeric: true,
    disablePadding: false,
    label: 'ROC_AUC'
  },
  {
    id: 'RANK',
    numeric: false,
    disablePadding: false,
    label: 'RANK'
  },
  {
    id: 'EXPORT',
    numeric: false,
    disablePadding: false,
    label: 'EXPORT'
  }
];



class ModelTableHead extends React.Component {
  createSortHandler = property => event => (
    this.props.onRequestSort(event, property)
  );

  render() {
    const {
      onSelectAllClick, order, orderBy, numSelected, rowCount
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              padding={column.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === column.id ? order : false}
            >
              <Tooltip
                title="Sort"
                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                  className={this.props.classes.header}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}

ModelTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default withStyles(styles)(ModelTableHead);
