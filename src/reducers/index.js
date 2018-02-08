import { combineReducers } from 'redux';
import { errorMsg, activeStep, variableVar, exploreYVar, ta2port, ta2session,
  selectedPipelines } from './app';
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
  config,
  dataSchema,
  activeData,
  metadata,
  problems,
  pipelines
});

export default app;
