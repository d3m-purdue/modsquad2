import React from 'react';
import PropTypes from 'prop-types';
import Vega from 'react-vega';
import map from 'lodash.map';
import groupBy from 'lodash.groupby';
import quantile from 'd3-array/src/quantile';

const BoxPlot = ({
  data, xField, yField, yCat, width, height
}) => {
  let spec = {};
  if (yCat === true) {
    const grp = groupBy(data, d => d[yField]);
    const dat = map(grp, (value, prop) => {
      const vals = value.map(dd => dd[xField]);
      vals.sort((a, b) => a - b);
      return ({
        var: prop,
        min: quantile(vals, 0),
        q1: quantile(vals, 0.25),
        median: quantile(vals, 0.5),
        q3: quantile(vals, 0.75),
        max: quantile(vals, 1),
        n: vals.length
      });
    });
    dat.sort((a, b) => (b.n > a.n ? 1 : b.n < a.n ? -1 : 0));
    // if ((dat.length / data.length) > 0.95) {
    //   return ('');
    // }
    const dats = dat.slice(0, 15);

    /* eslint-disable */
    spec = {
      "$schema": "https://vega.github.io/schema/vega/v3.0.json",
      "width": width,
      "height": height,
      "padding": 5,

      "signals": [
        { "name": "fields",
          "value": dats.map(d => d.var) },
        { "name": "plotWidth", "value": height / dats.length - 20 }
      ],

      "data": [
        {
          "name": "table",
          "values": dats
        }
      ],

      "scales": [
        {
          "name": "yscale",
          "type": "band",
          "range": "height",
          "padding": 1,
          "domain": {"data": "table", "field": "var"}
        },
        {
          "name": "xscale",
          "type": "linear",
          "range": "width", "round": true,
          "domain": {"fields": [ {"data": "table", "field": "min" }, { "data": "table", "field": "max" }]},
          "zero": false, "nice": true
        }
      ],

      "axes": [
        {"orient": "bottom", "scale": "xscale", "zindex": 1, "title": xField,"labelAngle": 15},
        {"orient": "left", "scale": "yscale", "tickCount": 5, "zindex": 1, "title": yField}
      ],

      "marks": [
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "fill": {"value": "black"},
              "height": {"value": 1}
            },
            "update": {
              "yc": {"scale": "yscale", "field": "var"},
              "x": {"scale": "xscale", "field": "min"},
              "x2": {"scale": "xscale", "field": "max"}
            }
          }
        },
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "fill": {"value": "#448aff"}
            },
            "update": {
              "yc": {"scale": "yscale", "field": "var"},
              "height": {"signal": "plotWidth / 2"},
              "x": {"scale": "xscale", "field": "q1"},
              "x2": {"scale": "xscale", "field": "q3"}
            }
          }
        },
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "fill": {"value": "black"},
              "width": {"value": 2}
            },
            "update": {
              "yc": {"scale": "yscale", "field": "var"},
              "height": {"signal": "plotWidth / 2"},
              "x": {"scale": "xscale", "field": "median"}
            }
          }
        }
      ]
    };
    /* eslint-enable */
  } else {
    const grp = groupBy(data, d => d[xField]);
    const dat = map(grp, (value, prop) => {
      const vals = value.map(dd => dd[yField]);
      vals.sort((a, b) => a - b);
      return ({
        var: prop,
        min: quantile(vals, 0),
        q1: quantile(vals, 0.25),
        median: quantile(vals, 0.5),
        q3: quantile(vals, 0.75),
        max: quantile(vals, 1),
        n: vals.length
      });
    });
    dat.sort((a, b) => (b.n > a.n ? 1 : b.n < a.n ? -1 : 0));
    // if ((dat.length / data.length) > 0.95) {
    //   return ('');
    // }
    const dats = dat.slice(0, 15);

    /* eslint-disable */
    spec = {
      "$schema": "https://vega.github.io/schema/vega/v3.0.json",
      "width": width,
      "height": height,
      "padding": 5,

      "signals": [
        { "name": "fields",
          "value": dats.map(d => d.var) },
        { "name": "plotWidth", "value": width / dats.length - 20 }
      ],

      "data": [
        {
          "name": "table",
          "values": dats
        }
      ],

      "scales": [
        {
          "name": "xscale",
          "type": "band",
          "range": "width",
          "padding": 1,
          "domain": {"data": "table", "field": "var"}
        },
        {
          "name": "yscale",
          "type": "linear",
          "range": "height", "round": true,
          "domain": {"fields": [ {"data": "table", "field": "min" }, { "data": "table", "field": "max" }]},
          "zero": false, "nice": true
        }
      ],

      "axes": [
        {"orient": "left", "scale": "yscale", "zindex": 1, "title": yField},
        {"orient": "bottom", "scale": "xscale", "tickCount": 5, "zindex": 1, "title": xField}
      ],

      "marks": [
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "fill": {"value": "black"},
              "width": {"value": 1}
            },
            "update": {
              "xc": {"scale": "xscale", "field": "var"},
              "y": {"scale": "yscale", "field": "min"},
              "y2": {"scale": "yscale", "field": "max"}
            }
          }
        },
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "fill": {"value": "#448aff"}
            },
            "update": {
              "xc": {"scale": "xscale", "field": "var"},
              "width": {"signal": "plotWidth / 2"},
              "y": {"scale": "yscale", "field": "q1"},
              "y2": {"scale": "yscale", "field": "q3"}
            }
          }
        },
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "fill": {"value": "black"},
              "height": {"value": 2}
            },
            "update": {
              "xc": {"scale": "xscale", "field": "var"},
              "width": {"signal": "plotWidth / 2"},
              "y": {"scale": "yscale", "field": "median"}
            }
          }
        }
      ]
    };
    /* eslint-enable */
  }

  return (
    <Vega
      spec={spec}
      // onSignalHover={handleHover}
    />
  );
};

BoxPlot.propTypes = {
  data: PropTypes.array.isRequired,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
  yCat: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default BoxPlot;
