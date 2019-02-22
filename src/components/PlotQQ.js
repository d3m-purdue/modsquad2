import React from 'react';
import PropTypes from 'prop-types';
import Vega from 'react-vega';

const QQ = ({
  data, field, width, height
}) => {
  const sq = x => x * x;
  const inverf = (x) => {
    const a = 0.147;
    const term1 = Math.log(1 - sq(x)) / 2;
    const term = (2 / (Math.PI * a)) + term1;
    return Math.sign(x) * Math.sqrt(Math.sqrt(sq(term) - term1) - term);
  };
  const normQuantile = p => Math.sqrt(2) * inverf((2 * p) - 1);

  const xformData = (dat, fld) => {
    // Sort the data.
    const datsorted = dat.map(d => d[fld]);
    datsorted.sort((a, b) => a - b);

    // Generate expected order statistics from the normal distribution.
    const a = datsorted.length <= 10 ? 0.375 : 0.5;
    const arg = i => (i - a) / ((datsorted.length + 1) - (2 * a));
    const order = datsorted.map((_, i) => i).map(arg).map(normQuantile);

    const newData = [];
    datsorted.forEach((d, i) => {
      newData.push({
        value: d,
        order: order[i]
      });
    });

    return newData;
  };
  const qqdat = xformData(data, field);

  /* eslint-disable */
  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
    "width": width,
    "height": height,
    "padding": 5,

    "data": [
      {
        "name": "table",
        "values": qqdat
      }
    ],
    "scales": [
      {
        "name": "x",
        "type": "linear",
        "domain": {"data": "table", "field": "order"},
        "range": "width",
        "zero": false
      },
      {
        "name": "y",
        "type": "linear",
        "domain": {"data": "table", "field": "value"},
        "range": "height",
        "zero": false
      }
    ],

    "axes": [
      {
        "scale": "x",
        "grid": true,
        "domain": false,
        "orient": "bottom",
        "labelAngle": 15,
        "tickCount": 5,
        "title": "Order"
      },
      {
        "scale": "y",
        "grid": true,
        "domain": false,
        "orient": "left",
        "titlePadding": 5,
        "title": "value"
      }
    ],

    "marks": [
      {
        "name": "marks",
        "type": "symbol",
        "from": {"data": "table"},
        "encode": {
          "update": {
            "x": {"scale": "x", "field": "order"},
            "y": {"scale": "y", "field": "value"},
            "shape": {"value": "circle"},
            "strokeWidth": {"value": 1},
            "opacity": {"value": 0.5},
            "stroke": {"value": "#448aff"},
            "fill": {"value": "transparent"}
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

QQ.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default QQ;
