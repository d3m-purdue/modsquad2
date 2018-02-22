import React from 'react';
import PropTypes from 'prop-types';
import Vega from 'react-vega';
import countBy from 'lodash.countby';
import map from 'lodash.map';
import filter from 'lodash.filter';

const CatHeatmap = ({
  data, xField, yField, width, height, normCols, normRows
}) => {
  const agg = countBy(data, d => `${d[xField]}___${d[yField]}`);
  const dat = map(agg, (value, prop) => {
    const tmp = prop.split('___');
    return ({
      var1: tmp[0],
      var2: tmp[1],
      n: value
    });
  });

  let title = 'Count';

  if (normCols === true || normRows === true) {
    const totVars = {};
    let totVar = 'var1';
    if (normRows === true) {
      totVar = 'var2';
    }
    dat.forEach((d) => {
      if (totVars[d[totVar]] === undefined) {
        totVars[d[totVar]] = d.n;
      } else {
        totVars[d[totVar]] += d.n;
      }
    });
    for (let i = 0; i < dat.length; i += 1) {
      dat[i].n /= totVars[dat[i][totVar]];
    }
    title = `${normCols === true ? 'Column' : 'Row'}-wise Proportion`;
  }

  // limit to the top 15 (make this an argument to the component) of each variable
  const getTopN = (dt, field, N) => {
    const aggdat = countBy(dt, d => d[field]);
    const aggarr = map(aggdat, (value, prop) => ({ var: prop, count: value }));
    aggarr.sort((a, b) => (b.count > a.count ? 1 : b.count < a.count ? -1 : 0));
    const aggarrs = aggarr.slice(0, N);
    return aggarrs.map(d => d.var);
  };
  const topX = getTopN(data, xField, 15);
  const topY = getTopN(data, yField, 15);
  const datf = filter(dat, d => topX.indexOf(d.var1) >= 0 && topY.indexOf(d.var2) >= 0);

  /* eslint-disable */
  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
    "width": width,
    "height": height,
    "padding": 5,

    "data": [
      {
        "name": "table",
        "values": datf
      }
    ],

    "scales": [
      {
        "name": "xscale",
        "type": "band",
        "domain": {"data": "table", "field": "var1"},
        "range": "width"
      },
      {
        "name": "yscale",
        "type": "band",
        "domain": {"data": "table", "field": "var2"},
        "range": "height"
      },
      {
        "name": "color",
        "type": "sequential",
        "range": {"scheme": "viridis"},
        "domain": {"data": "table", "field": "n"},
        "zero": false, "nice": false
      }
    ],

    "axes": [
      {"orient": "bottom", "scale": "xscale", "title": xField},
      {"orient": "left", "scale": "yscale", "title": yField}
    ],

    "legends": [
      {"fill": "color", "type": "gradient", "title": title}
    ],

    "marks": [
      {
        "type": "rect",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": {"scale": "xscale", "field": "var1"},
            "width": {"scale": "xscale", "band": 1},
            "y": {"scale": "yscale", "field": "var2"},
            "height": {"scale": "yscale", "band": 1}
          },
          "update": {
            "fill": {"scale": "color", "field": "n"}
          }
        }
      }
    ]
  }
  /* eslint-enable */

  return (
    <Vega
      spec={spec}
      // onSignalHover={handleHover}
    />
  );
};

CatHeatmap.propTypes = {
  data: PropTypes.array.isRequired,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  normRows: PropTypes.bool.isRequired,
  normCols: PropTypes.bool.isRequired
};

export default CatHeatmap;
