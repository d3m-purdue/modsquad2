import React from 'react';
import PropTypes from 'prop-types';
import Vega from 'react-vega';

const Scatter = ({
  data, xField, yField, width, height
}) => {
  /* eslint-disable */
  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
    "width": width,
    "height": height,
    "padding": 5,
    "autosize": {"type": "fit", "resize": true},

    "signals": [
      { "name": "yField", "value": yField},
      { "name": "xField", "value": xField},
      { "name": "nullSize", "value": 8 },
      { "name": "nullGap", "update": "nullSize + 10" }
    ],

    "data": [
      {
        "name": "movies",
        "values": data,
        "transform": [
          {
            "type": "formula",
            "expr": "datum.Title + ' (' + (year(datum.Release_Date) || '?') + ')'",
            "as":   "tooltip"
          }
        ]
      },
      {
        "name": "valid",
        "source": "movies",
        "transform": [
          {
            "type": "filter",
            "expr": "datum[xField] != null && datum[yField] != null"
          }
        ]
      },
      {
        "name": "nullXY",
        "source": "movies",
        "transform": [
          {
            "type": "filter",
            "expr": "datum[xField] == null && datum[yField] == null"
          },
          { "type": "aggregate" }
        ]
      },
      {
        "name": "nullY",
        "source": "movies",
        "transform": [
          {
            "type": "filter",
            "expr": "datum[xField] != null && datum[yField] == null"
          }
        ]
      },
      {
        "name": "nullX",
        "source": "movies",
        "transform": [
          {
            "type": "filter",
            "expr": "datum[xField] == null && datum[yField] != null"
          }
        ]
      }
    ],

    "scales": [
      {
        "name": "yscale",
        "type": "linear",
        "range": [{"signal": "height - nullGap"}, 0],
        "nice": true,
        "domain": {"data": "valid", "field": {"signal": "yField"}},
        "zero": false
      },
      {
        "name": "xscale",
        "type": "linear",
        "range": [{"signal": "nullGap"}, {"signal": "width"}],
        "nice": true,
        "domain": {"data": "valid", "field": {"signal": "xField"}},
        "zero": false
      }
    ],

    "axes": [
      {
        "orient": "bottom", "scale": "xscale", "offset": 5, "format": "s",
        "labelAngle": 15,
        "title": {"signal": "xField"}
      },
      {
        "orient": "left", "scale": "yscale", "offset": 5, "format": "s",
        "title": {"signal": "yField"}
      }
    ],

    "marks": [
      {
        "type": "symbol",
        "from": {"data": "valid"},
        "encode": {
          "enter": {
            "size": {"value": 50},
            "tooltip": {"field": "tooltip"}
          },
          "update": {
            "x": {"scale": "xscale", "field": {"signal": "xField"}},
            "y": {"scale": "yscale", "field": {"signal": "yField"}},
            "fill": {"value": "#448aff"},
            "fillOpacity": {"value": 0.5},
            "zindex": {"value": 0}
          },
          "hover": {
            "fill": {"value": "rgb(225, 0, 80)"},
            "fillOpacity": {"value": 1},
            "zindex": {"value": 1}
          }
        }
      },
      {
        "type": "symbol",
        "from": {"data": "nullY"},
        "encode": {
          "enter": {
            "size": {"value": 50},
            "tooltip": {"field": "tooltip"}
          },
          "update": {
            "x": {"scale": "xscale", "field": {"signal": "xField"}},
            "y": {"signal": "height - nullSize/2"},
            "fill": {"value": "#aaa"},
            "fillOpacity": {"value": 0.2}
          },
          "hover": {
            "fill": {"value": "firebrick"},
            "fillOpacity": {"value": 1}
          }
        }
      },
      {
        "type": "symbol",
        "from": {"data": "nullX"},
        "encode": {
          "enter": {
            "size": {"value": 50},
            "tooltip": {"field": "tooltip"}
          },
          "update": {
            "x": {"signal": "nullSize/2"},
            "y": {"scale": "yscale", "field": {"signal": "yField"}},
            "fill": {"value": "#aaa"},
            "fillOpacity": {"value": 0.2},
            "zindex": {"value": 0}
          },
          "hover": {
            "fill": {"value": "firebrick"},
            "fillOpacity": {"value": 1},
            "zindex": {"value": 1}
          }
        }
      },
      {
        "type": "text",
        "interactive": false,
        "from": {"data": "nullXY"},
        "encode": {
          "update": {
            "x": {"signal": "nullSize", "offset": -4},
            "y": {"signal": "height", "offset": 13},
            "text": {"signal": "datum.count + ' null'"},
            "align": {"value": "right"},
            "baseline": {"value": "top"},
            "fill": {"value": "#999"},
            "fontSize": {"value": 9}
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

Scatter.propTypes = {
  data: PropTypes.array.isRequired,
  xField: PropTypes.string.isRequired,
  yField: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Scatter;
