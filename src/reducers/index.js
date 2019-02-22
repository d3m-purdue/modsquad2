import { combineReducers } from 'redux';
import {
  errorMsg, activeStep, variableVar, exploreYVar, ta2port, ta2timeout, ta2session,
  selectedPipelines, exportedPipelines, activeResultIndex, inactiveVariables,
  pipelineProgress, selectedExternalDatasets
} from './app';
import {
  config, activeData, dataSchema, metadata, problems, pipelines,
  executedPipelines, externalData
} from './data';

const app = combineReducers({
  errorMsg,
  activeStep,
  variableVar,
  exploreYVar,
  ta2port,
  ta2timeout,
  ta2session,
  selectedPipelines,
  executedPipelines,
  exportedPipelines,
  activeResultIndex,
  pipelineProgress,
  config,
  dataSchema,
  activeData,
  metadata,
  problems,
  pipelines,
  inactiveVariables,
  externalData,
  selectedExternalDatasets
});

export default app;
