import {
  SET_ERROR_MESSAGE, SET_ACTIVE_STEP, SET_SELECTED_PIPELINES,
  SET_VARIABLE_VAR, SET_EXPLORE_Y_VAR, SET_TA2_PORT, SET_TA2_TIMEOUT,
  SET_TA2_SESSION, SET_ACTIVE_RESULT_ID, SET_INACTIVE_VARIABLES,
  SET_PIPELINE_PROGRESS, SET_EXPORTED_PIPELINES
} from '../constants';

export const errorMsg = (state = '', action) => {
  switch (action.type) {
    case SET_ERROR_MESSAGE:
      return action.msg;
    default:
  }
  return state;
};

export const activeStep = (state = 0, action) => {
  switch (action.type) {
    case SET_ACTIVE_STEP:
      return action.val;
    default:
  }
  return state;
};

export const pipelineProgress = (state = 0, action) => {
  switch (action.type) {
    case SET_PIPELINE_PROGRESS:
      return action.val;
    default:
  }
  return state;
};

export const selectedPipelines = (state = [], action) => {
  switch (action.type) {
    case SET_SELECTED_PIPELINES:
      return Object.assign([], [], action.val);
    default:
  }
  return state;
};

export const variableVar = (state = '__info__', action) => {
  switch (action.type) {
    case SET_VARIABLE_VAR:
      return action.val;
    default:
  }
  return state;
};

export const exploreYVar = (state = '', action) => {
  switch (action.type) {
    case SET_EXPLORE_Y_VAR:
      return action.val;
    default:
  }
  return state;
};

export const ta2port = (state = 50051, action) => {
  switch (action.type) {
    case SET_TA2_PORT:
      return action.val;
    default:
  }
  return state;
};

export const ta2timeout = (state = 60, action) => {
  switch (action.type) {
    case SET_TA2_TIMEOUT:
      return action.val;
    default:
  }
  return state;
};

export const activeResultIndex = (state = '', action) => {
  switch (action.type) {
    case SET_ACTIVE_RESULT_ID:
      return action.val;
    default:
  }
  return state;
};

export const ta2session = (state = {}, action) => {
  switch (action.type) {
    case SET_TA2_SESSION:
      return Object.assign({}, {}, action.val);
    default:
  }
  return state;
};

export const inactiveVariables = (state = [], action) => {
  switch (action.type) {
    case SET_INACTIVE_VARIABLES:
      return Object.assign([], [], action.val);
    default:
  }
  return state;
};

export const exportedPipelines = (state = [], action) => {
  switch (action.type) {
    case SET_EXPORTED_PIPELINES:
      return Object.assign([], [], action.val);
    default:
  }
  return state;
};
