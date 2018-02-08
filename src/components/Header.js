import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Help from 'material-ui-icons/Help';
import { withStyles } from 'material-ui/styles';

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0
  },
  flex: {
    flex: 1
  }
};

const Header = ({ classes }) => (
  <AppBar position="static" className={classes.header}>
    <Toolbar>
      <Typography variant="title" color="inherit" className={classes.flex}>
        ModSquad
      </Typography>
      <IconButton
        // aria-owns={open ? 'menu-appbar' : null}
        // aria-haspopup="true"
        // onClick={this.handleMenu}
        color="inherit"
      >
        <Help />
      </IconButton>
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
