import React from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import ErrorSnack from './components/ErrorSnack';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {
    flex: 1,
    paddingBottom: 20
  },
  bodyWrap: {
    maxWidth: 1100,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 'auto'
  }
};

const App = ({ classes }) => (
  <div className={classes.root}>
    <Header />
    <div className={classes.bodyWrap}>
      <Body />
    </div>
    <Footer />
    <ErrorSnack />
  </div>
);

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
