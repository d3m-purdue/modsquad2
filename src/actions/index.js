import { json, csv } from 'd3-request';
import { SET_ERROR_MESSAGE, SET_ACTIVE_STEP, SET_TA2_SESSION,
  SET_VARIABLE_VAR, SET_EXPLORE_Y_VAR, SET_TA2_PORT, SET_TA2_TIMEOUT,
  SET_INACTIVE_VARIABLES, SET_SELECTED_PIPELINES,
  SET_ACTIVE_RESULT_ID, SET_PIPELINE_PROGRESS, SET_EXPORTED_PIPELINES,
  REQUEST_EXECUTED_PIPELINES, RECEIVE_EXECUTED_PIPELINES,
  REQUEST_CONFIG, RECEIVE_CONFIG, SET_DATA_SCHEMA,
  REQUEST_ACTIVE_DATA, RECEIVE_ACTIVE_DATA,
  REQUEST_METADATA, RECEIVE_METADATA,
  REQUEST_PROBLEMS, RECEIVE_PROBLEMS,
  REQUEST_PIPELINES, RECEIVE_PIPELINES, CANCEL_PIPELINES,
  REQUEST_EXTERNAL_DATASET_LIST, RECEIVE_EXTERNAL_DATASET_LIST,
  SET_SELECTED_EXTERNAL_DATASETS, REQUEST_DATASET_JOIN, RECEIVE_DATASET_JOIN } from '../constants';


// The prefix values with api/v1/modsquad are for the new girder plugin.  The 
// alternative (with no path prefex) is for the previous tangelo back-end.
// Select the prefix needed according to the back end in use or change his URL for connection
// with a different back-end server 

export const ajaxPrefix= 'http://54.85.103.8:8080/api/v1/modsquad'
//export const ajaxPrefix= 'http://localhost:8080/api/v1/modsquad'
//export const ajaxPrefix= 'http://localhost:8080'
//export const ajaxPrefix= 'http://10.108.4.60:8080/api/v1/modsquad'

export const setActiveStep = val => ({
  type: SET_ACTIVE_STEP,
  val
});

export const setVariableVar = val => ({
  type: SET_VARIABLE_VAR,
  val
});

export const setExploratoryYVar = val => ({
  type: SET_EXPLORE_Y_VAR,
  val
});

export const setTA2Port = val => ({
  type: SET_TA2_PORT,
  val
});

export const setTA2Timeout = val => ({
  type: SET_TA2_TIMEOUT,
  val
});

export const requestConfig = () => ({
  type: REQUEST_CONFIG
});

export const receiveConfig = dat => ({
  type: RECEIVE_CONFIG,
  config: dat,
  receivedAt: Date.now()
});

export const setDataSchema = val => ({
  type: SET_DATA_SCHEMA,
  val
});

export const requestActiveData = () => ({
  type: REQUEST_ACTIVE_DATA
});

export const receiveActiveData = dat => ({
  type: RECEIVE_ACTIVE_DATA,
  data: dat,
  receivedAt: Date.now()
});

export const requestMetadata = () => ({
  type: REQUEST_METADATA
});

export const receiveMetadata = dat => ({
  type: RECEIVE_METADATA,
  data: dat,
  receivedAt: Date.now()
});

export const requestProblems = () => ({
  type: REQUEST_PROBLEMS
});

export const receiveProblems = dat => ({
  type: RECEIVE_PROBLEMS,
  data: dat,
  receivedAt: Date.now()
});

export const requestPipelines = () => ({
  type: REQUEST_PIPELINES
});

export const cancelPipelines = () => ({
  type: CANCEL_PIPELINES
});

export const receivePipelines = dat => ({
  type: RECEIVE_PIPELINES,
  data: dat,
  receivedAt: Date.now()
});

export const setSelectedPipelines = val => ({
  type: SET_SELECTED_PIPELINES, val
});

export const setExportedPipelines = val => ({
  type: SET_EXPORTED_PIPELINES, val
});

export const setInactiveVariables = val => ({
  type: SET_INACTIVE_VARIABLES, val
});

export const requestExecutedPipelines = val => ({
  type: REQUEST_EXECUTED_PIPELINES, val
});

export const receiveExecutedPipelines = dat => ({
  type: RECEIVE_EXECUTED_PIPELINES,
  data: dat,
  receivedAt: Date.now()
});

export const setTA2Session = val => ({
  type: SET_TA2_SESSION, val
});

export const setActiveResultId = val => ({
  type: SET_ACTIVE_RESULT_ID, val
});

export const setPipelineProgress = val => ({
  type: SET_PIPELINE_PROGRESS, val
});

export const setErrorMessage = msg => ({
  type: SET_ERROR_MESSAGE, msg
});


// Jan 2019 - added additional actions for the external file operations

export const requestExternalDatasetList = val => ({
  type: REQUEST_EXTERNAL_DATASET_LIST, val
});

export const receiveExternalDatasetList = dat => ({
  type: RECEIVE_EXTERNAL_DATASET_LIST,
  data: dat,
  receivedAt: Date.now()
});

export const setSelectedExternalDatasets = val => ({
  type: SET_SELECTED_EXTERNAL_DATASETS, val
});

export const requestDatasetJoin = val => ({
  type: REQUEST_DATASET_JOIN, val
});

export const receiveDatsetJoin = dat => ({
  type: RECEIVE_DATASET_JOIN,
  data: dat,
  receivedAt: Date.now()
});

export const fetchConfig = (config = ajaxPrefix+'/config') =>
  (dispatch) => {
    dispatch(requestConfig());

    json(config, (cfg) => {
      dispatch(setDataSchema(cfg.dataset_schema));
      dispatch(receiveConfig(cfg));

      // now that we have the config information, look up the datasets
      dispatch(requestActiveData());
      json(ajaxPrefix+'/dataset/data', (dat) => {
        dispatch(receiveActiveData(dat));
      })
        .on('error', err => dispatch(setErrorMessage(
          `Couldn't load config: ${err.target.responseURL}`
        )));

      dispatch(requestMetadata());
      json(ajaxPrefix+'/dataset/metadata', (metadat) => {
        dispatch(receiveMetadata(metadat));
      })
        .on('error', err => dispatch(setErrorMessage(
          `Couldn't load config: ${err.target.responseURL}`
        )));

      dispatch(requestProblems());
      json(ajaxPrefix+'/dataset/problems', (contents) => {
        dispatch(setExploratoryYVar(contents[0].targets[0].colName));
        dispatch(receiveProblems(contents));
      });
    })
      .on('error', err => dispatch(setErrorMessage(
        `Couldn't load config: ${err.target.responseURL}`
      )));
  };

export const runTA2 = (port, dispatch, state) => {
  json(`/session?port=${port}`)
    .post({}, (session) => {
      const dataURI = state.config.config.dataset_schema;
      // const targetFeatures = state.problems.data[0].targets;

      // http://54.85.103.8:8080/api/v1/modsquad/pipeline?data_uri=/input/185_baseball/TRAIN/dataset_TRAIN/datasetDoc.json&time_limit=1&inactive=


      // generate a flag indicating if we are in dynamic dataset mode
      const dynamic_mode_flag = (state.config.config.dynamicMode === true) ? "True" : "False"
      
      // Gather the parameters needed for a CreatePipelines call.
      const params = {
        // context,
        data_uri: dataURI,
        time_limit: (state.ta2timeout/60),
        inactive: state.inactiveVariables,
        target: state.exploreYVar,
        dynamic_mode: dynamic_mode_flag
        // task_type: taskType,
        // max_pipelines: maxPipelines
      };
      // console.log('pipeline params:', params);

      const query = [];
      Object.entries(params).forEach(d => query.push(`${d[0]}=${d[1]}`));

      // perform pipeline call to TA2
      const url = ajaxPrefix+`/pipeline?${query.join('&')}`;
      console.log('url: ', url);

      dispatch(requestPipelines());
      json(url).post({}, (resp) => {
        // const respComplete = resp.filter(x => x.progressInfo === 'COMPLETED');
        dispatch(receivePipelines(resp.splice(2, resp.length - 1))); // splice will remove first 2 pipelines
      })
        .on('error', () => {
          dispatch(setErrorMessage(
            'There was an error running the pipelines...' // ${err.target.responseURL}
          ));
          dispatch(cancelPipelines());
        });
    });
};

export const loadDataset = (state, dispatch) => {
  if (state.selectedExternalDatasets.length > 0) {
    dispatch(receiveActiveData([]));
    dispatch(requestActiveData());

    dispatch(receiveMetadata([]));
    dispatch(requestMetadata());
    dispatch(requestProblems());

    const query =  ajaxPrefix+`/dataset/external_download?fileId=${state.selectedExternalDatasets[0]}`;

    json(query, (response) => {
      dispatch(receiveActiveData(response.data));
      dispatch(receiveMetadata(response.metadata));
      dispatch(setExploratoryYVar(response.yvar));
      dispatch(receiveProblems(response.problem));
      //dispatch(receiveConfig(Object.assign({}, { dynamicMode: true }, state.config.config)));
      dispatch(setDataSchema(response.config.dataset_schema));
      dispatch(receiveConfig(response.config));
    });
  }
};

export const getPipelinePredictions = (state, dispatch) => {
  const pipeResults = [];
  const nn = state.selectedPipelines.length;
  if (nn === 0) {
    return;
  }

  // for cache
  if (!window.__pipepredictcache__) {
    window.__pipepredictcache__ = {};
  }

  // const context = state.ta2session.context.sessionId;
  const dataURI = state.config.config.dataset_schema;

  const allIds = state.pipelines.data.map(d => d.solutionId);
  state.selectedPipelines.map((id) => {
    const d = state.pipelines.data[allIds.indexOf(id)];
    const params = {
      // context,
      pipeline: d.solutionId,
      data_uri: dataURI
    };

    const query = [];
    Object.entries(params).forEach(a => query.push(`${a[0]}=${a[1]}`));

    const url = ajaxPrefix+`/pipeline/execute?${query.join('&')}`;

    dispatch(requestExecutedPipelines());

    const cb = (resp) => {
      const respComplete = resp;
      // console.log('executed was:', respComplete);

      respComplete.exposed.forEach((pipeline) => {
        // read the CSV results from the pipeline. First, extract the filename from the path,
        // then add the accessible directory and read the file

        const { csvUri } = pipeline.exposedOutputs['outputs.0'];

        // read the CSV data into an object and store it in redux
        const csvData = ajaxPrefix+`/pipeline/results?resultURI=${csvUri}`;
        json(csvData, (predictedData) => {
          // console.log(predictedData[0]);
          pipeline.solution_id = d.solutionId;
          pipeline.fitted_solution_id = respComplete.fitted_solution_id[0];
          console.log('adding amazing solution id to pipeline: ', respComplete.fitted_solution_id[0]);
          pipeResults.push({ pipeline, data: predictedData });
          // console.log('pipe results length:', pipeResults.length);

          // if this is the lastt callback to run, populate the state
          if (pipeResults.length === nn) {
            dispatch(receiveExecutedPipelines(pipeResults));
          }
        });
      });
    };

    if (window.__pipepredictcache__[d.solutionId] === undefined) {
      json(url).post({}, (resp) => {
        window.__pipepredictcache__[d.solutionId] = resp;
        cb(resp);
      });
    } else {
      cb(window.__pipepredictcache__[d.solutionId]);
    }
    return null;
  });
};

export const exportPipeline = (pipelineId, state) => {
  // const context = state.ta2session.context.sessionId;
  // get solution from state here

  const currentlyExecutedIds = state.executedPipelines.data.map(d => d.pipeline.solution_id);
  const idx = currentlyExecutedIds.indexOf(pipelineId);
  // const currentlyExecutedIds = Object.keys(window.__pipepredictcache__);

  const fittedId = state.executedPipelines.data[idx].pipeline.fitted_solution_id;
  // const fittedId = window.__pipepredictcache__[pipelineId].fitted_solution_id;

  const params = {
    pipeline: fittedId
  };

  const query = [];
  Object.entries(params).forEach(d => query.push(`${d[0]}=${d[1]}`));

  const url = ajaxPrefix+`/pipeline/export?${query.join('&')}`;

  json(url).post({}, (resp) => {
    console.log('export pipeline response:');
    console.log(resp);
  });
};

// ** below added for external dataset integration

// function to dispatch the actions added for reading from external data list
export const getExternalDatasetList = (externalDataList = ajaxPrefix+'/dataset/external_list') =>
  (dispatch) => {
    dispatch(requestExternalDatasetList());

    json(externalDataList, (dlist) => {
      dispatch(receiveExternalDatasetList(dlist.data));
    });
};

// function to dispatch the actions added for joining two datasets.  FileIDs and either "rows" or "columns"
export const getDatasetJoin = (joinResult = ajaxPrefix+'/dataset/merge',joinSpec) =>
  (dispatch) => {
    dispatch(requestDatasetJoin(joinSpec));

    json(joinResult, (dlist) => {
      dispatch(receiveExternalDatasetList(dlist.data));
    });
};