import React from 'react';
import PropTypes from 'prop-types';
import Vega from 'react-vega';

const Histogram = ({
  data, field, width, height
}) => {
  /* eslint-disable */
  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
    "width": width,
    "height": height,
    "padding": 5,
    "autosize": {"type": "fit", "resize": true},
    "signals": [
      {
        "name": "binDomain",
        "update": "sequence(bins.start, bins.stop + bins.step, bins.step)"
      },
      {
        "name": "nullGap", "value": 10
      },
      {
        "name": "barStep",
        "update": "(width - nullGap) / binDomain.length"
      }
    ],
    "data": [
      {
        "name": "table",
        "values": data,
        "transform": [
          {
            "type": "extent", "field": field,
            "signal": "extent"
          },
          {
            "type": "bin", "signal": "bins",
            "field": field, "extent": {"signal": "extent"},
            "maxbins": 15
          }
        ]
      },
      {
        "name": "counts",
        "source": "table",
        "transform": [
          {
            "type": "filter",
            "expr": `datum['${field}'] != null`
          },
          {
            "type": "aggregate",
            "groupby": ["bin0", "bin1"]
          }
        ]
      },
      {
        "name": "nulls",
        "source": "table",
        "transform": [
          {
            "type": "filter",
            "expr": `datum['${field}'] == null`
          },
          {
            "type": "aggregate"
          }
        ]
      }
    ],

    "scales": [
      {
        "name": "yscale",
        "type": "linear",
        "range": "height",
        "round": true, "nice": true,
        "domain": {
          "fields": [
            {"data": "counts", "field": "count"},
            {"data": "nulls", "field": "count"}
          ]
        }
      },
      {
        "name": "xscale",
        "type": "bin-linear",
        "range": [{"signal": "barStep + nullGap"}, {"signal": "width"}],
        "round": true,
        "domain": {"signal": "binDomain"}
      },
      {
        "name": "xscale-null",
        "type": "band",
        "range": [0, {"signal": "barStep"}],
        "round": true,
        "domain": [null]
      }
    ],

    "axes": [
      {"orient": "bottom", "scale": "xscale", "tickCount": 10,"labelAngle": 15,"labelOverlap":true},
      // CRL I don't know what the line below is supposed to do.  It renders "null" in the histogram
      //{"orient": "bottom", "scale": "xscale-null"},
      {"orient": "left", "scale": "yscale", "tickCount": 5, "offset": 5}
    ],

    "marks": [
      {
        "type": "rect",
        "from": {"data": "counts"},
        "encode": {
          "update": {
            "x": {"scale": "xscale", "field": "bin0", "offset": 1},
            "x2": {"scale": "xscale", "field": "bin1"},
            "y": {"scale": "yscale", "field": "count"},
            "y2": {"scale": "yscale", "value": 0},
            "fill": {"value": "#448aff"}
          },
          "hover": {
            "fill": {"value": "rgb(225, 0, 80)"}
          }
        }
      },
      {
        "type": "rect",
        "from": {"data": "nulls"},
        "encode": {
          "update": {
            "x": {"scale": "xscale-null", "value": null, "offset": 1},
            "x2": {"scale": "xscale-null", "band": 1},
            "y": {"scale": "yscale", "field": "count"},
            "y2": {"scale": "yscale", "value": 0},
            "fill": {"value": "#aaa"}
          },
          "hover": {
            "fill": {"value": "firebrick"}
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

Histogram.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Histogram;
