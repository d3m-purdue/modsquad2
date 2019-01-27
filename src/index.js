import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import lightBlue from 'material-ui/colors/lightBlue';

import './index.css';
import App from './App';
import app from './reducers';
import { fetchConfig, getExternalDatasetList } from './actions';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
  app,
  // { initial state... },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware, createLogger())
);

if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(app)
    })
  }
}

const theme = createMuiTheme({
  palette: {
    primary: { light: blue['A100'], main: blue['A200'] },
    secondary: { light: lightBlue[200], main: lightBlue[700] }
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontWeightLight: 200,
    body1: {
      fontSize: 16
    },
    fontWeightRegular: 300,
    fontWeightMedium: 400
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render(
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </MuiThemeProvider>,
      document.getElementById('root')
    );
  })
}

// fill the dataset table for any datasets already there.  
// TODO: We want to reload this right as we enter the dataset panel, instead of once in the beginning. This 
// is just a way to force the event.
store.dispatch(getExternalDatasetList());

// initialize with a dataset from the D3M problem statement
store.dispatch(fetchConfig());

registerServiceWorker();
