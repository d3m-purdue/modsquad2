import { histogram, extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';

const getHistogram = (data, variable) => {
  const vec = data.map(a => a[variable]);
  const range = extent(vec);
  const sl = scaleLinear()
    .domain(range);
  const tcks = sl.ticks(10);
  const delta = tcks[1] - tcks[0];
  const breaks = [tcks[0] - delta].concat(tcks).concat([tcks[tcks.length - 1] + delta]);
  const hst = histogram()
    .domain(range)
    .thresholds(tcks);
  const bins = hst(vec);
  const freq = bins.map(a => a.length);
  return ({
    range,
    breaks,
    freq,
    delta
  });
};

const getCogInfo = (data, variable, panelCol) => {
  if (variable === 'panelKey') {
    return ({
      name: variable,
      desc: 'panel key',
      type: 'key',
      group: 'panelKey',
      defLabel: false,
      defActive: true,
      filterable: false,
      log: null
    });
  } else if (variable === panelCol) {
    return ({
      name: variable,
      desc: 'panel image source URL',
      type: 'panelSrc',
      group: 'common',
      defLabel: false,
      defActive: true,
      filterable: false,
      log: null
    });
  } else if (typeof data[0][variable] === 'string') {
    // compute levels...
    const vr = data.map(a => a[variable]);
    const levels = vr.filter((item, i, ar) => ar.indexOf(item) === i);
    return ({
      name: variable,
      desc: variable,
      type: 'factor',
      group: 'condVar',
      defLabel: false,
      defActive: true,
      filterable: true,
      log: null,
      levels
    });
  } else {
    // compute range, nnna, breaks, delta
    const hst = getHistogram(data, variable);
    return ({
      name: variable,
      desc: variable,
      type: 'numeric',
      group: 'common',
      defLabel: false,
      defActive: true,
      filterable: true,
      log: null,
      range: hst.range,
      nnna: data.length, // TODO - actually calculate this
      breaks: hst.breaks,
      delta: hst.delta
    });
  }
};

const getCogDistns = (data, variable, panelCol) => {
  if (variable === 'panelKey') {
    return ({
      type: 'key',
      dist: {}
    });
  } else if (variable === panelCol) {
    return ({
      type: 'panelSrc',
      dist: {}
    });
  } else if (typeof data[0][variable] === 'string') {
    // compute dist
    const dist = {};
    data.forEach((d) => {
      if (dist[d[variable]] === undefined) {
        dist[d[variable]] = 1;
      } else {
        dist[d[variable]] += 1;
      }
    });
    return ({
      type: 'factor',
      dist,
      has_dist: true,
      max: 1
    });
  } else {
    // compute breaks, freq
    const hst = getHistogram(data, variable);
    return ({
      type: 'numeric',
      dist: {
        raw: {
          breaks: hst.breaks,
          freq: hst.freq
        }
      },
      log_default: false
    });
  }
};

const createTrelliscopeSpec = (spec) => {
  const {
    data, name, group, desc, height, width, nrow, ncol,
    panelCol, panelKey, labels, updated, keySig
  } = spec;

  // add panelKey to data (repeat of panelCol)
  for (let i = 0; i < data.length; i += 1) {
    // data[i].panelKey = data[i][panelKey].replace(/\./g, '_');
    data[i].panelKey = data[i][panelKey];
  }

  const colNames = Object.keys(data[0]);

  const cogInfo = {};
  colNames.forEach((nm) => {
    cogInfo[nm] = getCogInfo(data, nm, panelCol);
  });

  const cogDistns = {};
  colNames.forEach((nm) => {
    cogDistns[nm] = getCogDistns(data, nm, panelCol);
  });

  const config = {
    display_base: '__self__',
    data_type: 'json',
    cog_server: {
      type: 'json',
      info: {
        base: '__self__'
      }
    },
    split_layout: false,
    has_legend: false
  };

  const displayList = [{
    group,
    name,
    desc,
    n: data.length,
    height,
    width,
    updated,
    keySig
  }];

  const displayObj = {
    name,
    group,
    desc,
    mdDesc: '',
    updated,
    n: data.length,
    height,
    width,
    has_legend: false,
    split_layout: false,
    split_aspect: {},
    keySig,
    cogInterface: {
      name,
      group,
      type: 'JSON'
    },
    panelInterface: {
      type: 'image_src',
      panelCol
    },
    cogInfo,
    cogDistns,
    state: {
      layout: {
        nrow,
        ncol,
        arrange: 'row'
      },
      labels,
      sort: [ // sort
        {
          order: 1,
          name: panelKey,
          dir: 'asc'
        }
      ]
    }
  };

  return ({
    config,
    displayList,
    displayObj,
    cogData: data
  });
};

export default createTrelliscopeSpec;
