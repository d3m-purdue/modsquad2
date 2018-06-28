import { combineReducers } from 'redux';
import { errorMsg, activeStep, variableVar, exploreYVar, ta2port, ta2session,
  selectedPipelines, activeResultIndex, inactiveVariables } from './app';
import { config, activeData, dataSchema, metadata, problems, pipelines,
  executedPipelines } from './data';

const app = combineReducers({
  errorMsg,
  activeStep,
  variableVar,
  exploreYVar,
  ta2port,
  ta2session,
  selectedPipelines,
  executedPipelines,
  activeResultIndex,
  config,
  dataSchema,
  activeData,
  metadata,
  problems,
  pipelines,
  inactiveVariables
});

export default app;
