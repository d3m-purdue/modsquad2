export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_ACTIVE_STEP = 'SET_ACTIVE_STEP';
export const SET_EXPLORE_Y_VAR = 'SET_EXPLORE_Y_VAR';
export const SET_VARIABLE_VAR = 'SET_VARIABLE_VAR';
export const SET_TA2_PORT = 'SET_TA2_PORT';
export const REQUEST_CONFIG = 'REQUEST_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
export const REQUEST_ACTIVE_DATA = 'REQUEST_ACTIVE_DATA';
export const RECEIVE_ACTIVE_DATA = 'RECEIVE_ACTIVE_DATA';
export const REQUEST_METADATA = 'REQUEST_METADATA';
export const RECEIVE_METADATA = 'RECEIVE_METADATA';
export const REQUEST_PROBLEMS = 'REQUEST_PROBLEMS';
export const RECEIVE_PROBLEMS = 'RECEIVE_PROBLEMS';
export const REQUEST_PIPELINES = 'REQUEST_PIPELINES';
export const RECEIVE_PIPELINES = 'RECEIVE_PIPELINES';
export const CANCEL_PIPELINES = 'CANCEL_PIPELINES';
export const REQUEST_EXECUTED_PIPELINES = 'REQUEST_EXECUTED_PIPELINES';
export const RECEIVE_EXECUTED_PIPELINES = 'RECEIVE_EXECUTED_PIPELINES';
export const SET_DATA_SCHEMA = 'SET_DATA_SCHEMA';
export const SET_SELECTED_PIPELINES = 'SET_SELECTED_PIPELINES';
export const SET_TA2_SESSION = 'SET_TA2_SESSION';
export const SET_ACTIVE_RESULT_ID = 'SET_ACTIVE_RESULT_ID';
export const SET_INACTIVE_VARIABLES = 'SET_INACTIVE_VARIABLES';
export const SET_PIPELINE_PROGRESS = 'SET_PIPELINE_PROGRESS';
export const SET_TA2_TIMEOUT = 'SET_TA2_TIMEOUT';
export const SET_EXPORTED_PIPELINES = 'SET_EXPORTED_PIPELINES';

// edded for external data import, an alternative data source to the D3M problem declarations
export const REQUEST_EXTERNAL_DATASET_LIST = 'REQUEST_EXTERNAL_DATASET_LIST'
export const RECEIVE_EXTERNAL_DATASET_LIST = 'RECEIVE_EXTERNAL_DATASET_LIST'

export const getSteps = () => ([
  'Welcome',
  'Extra Data',
  'GeoApp',
  'Datasets',
  'Variables',
  'Exploratory Vis',
  'Model Discovery',
  'Model Results Vis',
  'Quit'
]);

export const chipColors = {
  categorical: '#1F77B4',
  real: '#FF7F0E',
  integer: '#2CA02C',
  string: '#D62728'
};
// '#D62728' '#9467BD' '#8C564B' '#E377C2' '#7F7F7F'
