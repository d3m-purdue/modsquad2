import { REQUEST_CONFIG, RECEIVE_CONFIG, SET_DATA_SCHEMA,
  REQUEST_ACTIVE_DATA, RECEIVE_ACTIVE_DATA,
  REQUEST_METADATA, RECEIVE_METADATA,
  REQUEST_PROBLEMS, RECEIVE_PROBLEMS,
  REQUEST_EXECUTED_PIPELINES, RECEIVE_EXECUTED_PIPELINES,
  REQUEST_PIPELINES, RECEIVE_PIPELINES, CANCEL_PIPELINES,
  REQUEST_EXTERNAL_DATASET_LIST, RECEIVE_EXTERNAL_DATASET_LIST } from '../constants';

export const config = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  config: {}
}, action) => {
  switch (action.type) {
    case REQUEST_CONFIG:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_CONFIG:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        config: action.config,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};


export const dataSchema = (state = '', action) => {
  switch (action.type) {
    case SET_DATA_SCHEMA:
      return action.val;
    default:
  }
  return state;
};

export const activeData = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: []
}, action) => {
  switch (action.type) {
    case REQUEST_ACTIVE_DATA:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_ACTIVE_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: action.data,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export const metadata = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: []
}, action) => {
  switch (action.type) {
    case REQUEST_METADATA:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_METADATA:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: action.data,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export const problems = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: []
}, action) => {
  switch (action.type) {
    case REQUEST_PROBLEMS:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_PROBLEMS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: action.data,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export const pipelines = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: []
}, action) => {
  switch (action.type) {
    case REQUEST_PIPELINES:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case CANCEL_PIPELINES:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_PIPELINES:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: action.data,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export const executedPipelines = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: []
}, action) => {
  switch (action.type) {
    case REQUEST_EXECUTED_PIPELINES:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_EXECUTED_PIPELINES:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: action.data,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

// added for external data import
export const externalData = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  externalData: {}
}, action) => {
  switch (action.type) {
    case REQUEST_EXTERNAL_DATASET_LIST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_EXTERNAL_DATASET_LIST:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        config: action.config,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};