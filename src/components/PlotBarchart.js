import React from 'react';
import PropTypes from 'prop-types';
import Vega from 'react-vega';
import countBy from 'lodash.countby';
import map from 'lodash.map';

const Barchart = ({
  data, field, width, height
}) => {
  const agg = countBy(data, d => d[field]);
  const aggarr = map(agg, (value, prop) => ({ var: prop, count: value }));
  aggarr.sort((a, b) => (b.count > a.count ? 1 : b.count < a.count ? -1 : 0));
  // if (aggarr.length > 25)

  /* eslint-disable */
  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
    "width": width,
    "height": height,
    "padding": 5,

    "data": [
      {
        "name": "table",
        "values": aggarr.slice(0, 25)
      }
    ],
    "signals": [
      {
        "name": "tooltip",
        "value": {},
        "on": [
          {"events": "rect:mouseover", "update": "datum"},
          {"events": "rect:mouseout",  "update": "{}"}
        ]
      }
    ],
    "scales": [
      {
        "name": "xscale",
        "type": "band",
        "domain": {"data": "table", "field": "var"},
        "range": "width",
        "padding": 0.05,
        "round": true
      },
      {
        "name": "yscale",
        "domain": {"data": "table", "field": "count"},
        "nice": true,
        "range": "height"
      }
    ],

    "axes": [
      {
        "orient": "bottom",
        "scale": "xscale",
        "labelAngle": 30,
        "labelAlign":"left",
        "labelOverlap": false,
        "labelFlush": true,
        "properties": {
          "labels": {
            "angle": { "value": 50 }
          }
        }
      },
      { "orient": "left", "scale": "yscale" }
    ],

    "marks": [
      {
        "type": "rect",
        "from": {"data":"table"},
        "encode": {
          "enter": {
            "x": {"scale": "xscale", "field": "var"},
            "width": {"scale": "xscale", "band": 1},
            "y": {"scale": "yscale", "field": "count"},
            "y2": {"scale": "yscale", "value": 0}
          },
          "update": {
            "fill": {"value": "#448aff"}
          },
          "hover": {
            "fill": {"value": "rgb(225, 0, 80)"}
          }
        }
      },
      {
        "type": "text",
        "encode": {
          "enter": {
            "align": {"value": "center"},
            "baseline": {"value": "bottom"},
            "fill": {"value": "#333"}
          },
          "update": {
            "x": {"scale": "xscale", "signal": "tooltip.var", "band": 0.5},
            "y": {"scale": "yscale", "signal": "tooltip.count", "offset": -2},
            "text": {"signal": "tooltip.count"},
            "fillOpacity": [
              {"test": "datum === tooltip", "value": 0},
              {"value": 1}
            ]
          }
        }
      }
    ]
  }
  /* eslint-enable */

  return (<Vega spec={spec} />);
};

Barchart.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Barchart;
