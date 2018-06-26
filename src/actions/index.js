import { json, csv } from 'd3-request';
import { SET_ERROR_MESSAGE, SET_ACTIVE_STEP, SET_TA2_SESSION,
  SET_VARIABLE_VAR, SET_EXPLORE_Y_VAR, SET_TA2_PORT, SET_SELECTED_PIPELINES,
  REQUEST_EXECUTED_PIPELINES, RECEIVE_EXECUTED_PIPELINES,
  REQUEST_CONFIG, RECEIVE_CONFIG, SET_DATA_SCHEMA,
  REQUEST_ACTIVE_DATA, RECEIVE_ACTIVE_DATA,
  REQUEST_METADATA, RECEIVE_METADATA,
  REQUEST_PROBLEMS, RECEIVE_PROBLEMS,
  REQUEST_PIPELINES, RECEIVE_PIPELINES } from '../constants';

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

export const receivePipelines = dat => ({
  type: RECEIVE_PIPELINES,
  data: dat,
  receivedAt: Date.now()
});

export const setSelectedPipelines = val => ({
  type: SET_SELECTED_PIPELINES, val
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

export const setErrorMessage = msg => ({
  type: SET_ERROR_MESSAGE, msg
});

export const fetchConfig = (config = '/config') =>
  (dispatch) => {
    dispatch(requestConfig());

    json(config, (cfg) => {
      dispatch(setDataSchema(cfg.dataset_schema));
      dispatch(receiveConfig(cfg));

      // now that we have the config information, look up the datasets
      dispatch(requestActiveData());
      json('/dataset/data', (dat) => {
        dispatch(receiveActiveData(dat));
      })
        .on('error', err => dispatch(setErrorMessage(
          `Couldn't load config: ${err.target.responseURL}`
        )));

      dispatch(requestMetadata());
      json('/dataset/metadata', (metadat) => {
        dispatch(receiveMetadata(metadat));
      })
        .on('error', err => dispatch(setErrorMessage(
          `Couldn't load config: ${err.target.responseURL}`
        )));

      dispatch(requestProblems());
      json('/dataset/problems', (contents) => {
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
      console.log(session);

      const dataURI = state.config.config.dataset_schema;
      const targetFeatures = state.problems.data[0].targets;
      const { taskType } = state.problems.data[0];
      const { taskSubType } = state.problems.data[0];
      // predict_features is currently ignored
      // Later user will be able to select features to use during prediction
      const predictFeatures = [];
      const { metrics } = state.problems.data[0];
      const maxPipelines = 5;

      // const context = session.context.sessionId;

      // dispatch(setTA2Session(session));

      // Gather the parameters needed for a CreatePipelines call.
      const params = {
        // context,
        data_uri: dataURI,
        // task_type: taskType,
        // task_subtype: taskSubType,
        // metrics,
        // target_features: targetFeatures,
        // predict_features: predictFeatures,
        // max_pipelines: maxPipelines
      };
      console.log('pipeline params:', params);

      const query = [];
      Object.entries(params).forEach(d => query.push(`${d[0]}=${d[1]}`));

      // perform pipeline call to TA2
      const url = `/pipeline?${query.join('&')}`;
      console.log('url: ', url);

      dispatch(requestPipelines());
      json(url).post({}, (resp) => {
        console.log(resp);

        const respComplete = resp.filter(x => x.progressInfo === 'COMPLETED');
        dispatch(receivePipelines(respComplete));
      })
        .on('error', () => dispatch(setErrorMessage(
          'There was an error running the pipelines...' // ${err.target.responseURL}
        )));
    });
};

export const getPipelinePredictions = (state, dispatch) => {
  const pipeResults = [];
  const nn = state.selectedPipelines.length;
  if (nn === 0) {
    return;
  }

  const context = state.ta2session.context.sessionId;
  const dataURI = state.config.config.dataset_schema;

  state.selectedPipelines.map((ii) => {
    const d = state.pipelines.data[ii];
    const params = {
      context,
      pipeline: d.pipelineId,
      data_uri: dataURI
    };

    const query = [];
    Object.entries(params).forEach(a => query.push(`${a[0]}=${a[1]}`));

    const url = `/pipeline/execute?${query.join('&')}`;

    dispatch(requestExecutedPipelines());

    json(url).post({}, (resp) => {
      const respComplete = resp.filter(x => x.progressInfo === 'COMPLETED');
      respComplete.forEach((pipeline) => {
        // read the CSV results from the pipeline. First, extract the filename from the path,
        // then add the accessible directory and read the file
        const filename = pipeline.resultUri.substring(pipeline.resultUri.lastIndexOf('/') + 1);
        const accessibleLocation = `pipelines/${filename}`;

        // read the CSV data into an object and store it in redux
        csv(accessibleLocation, (predictedData) => {
          // console.log(predictedData[0]);
          pipeResults.push({ pipeline, data: predictedData });
          console.log(pipeResults.length);

          // if this is the lastt callback to run, populate the state
          if (pipeResults.length === nn) {
            dispatch(receiveExecutedPipelines(pipeResults));
          }
        });
      });
    });
    return null;
  });
};

export const exportPipeline = (pipelineId, state) => {
  const context = state.ta2session.context.sessionId;

  const params = {
    context,
    pipeline: pipelineId
  };

  const query = [];
  Object.entries(params).forEach(d => query.push(`${d[0]}=${d[1]}`));

  const url = `/pipeline/export?${query.join('&')}`;

  json(url).post({}, (resp) => {
    console.log('export pipeline response:');
    console.log(resp);
  });
};
