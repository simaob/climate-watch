import React from 'react';
import PropTypes from 'prop-types';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

import CustomTooltip from '../tooltip';

const StackedBarChart = ({ className, width, height, config }) => (
  <ResponsiveContainer className={className} width={width} height={height}>
    <BarChart {...config.chart}>
      {config.xAxis && <XAxis {...config.xAxis} />}
      {config.yAxis && <YAxis {...config.yAxis} />}
      {config.cartesianGrid && <CartesianGrid {...config.cartesianGrid} />}
      {config.columns &&
        config.columns.y.map(y => (
          <Bar dataKey={y} key={y} {...config.theme[y]} stackId="a" />
        ))}
      {config.tooltip && <Tooltip content={<CustomTooltip {...config} />} />}
    </BarChart>
  </ResponsiveContainer>
);

StackedBarChart.propTypes = {
  className: PropTypes.string,
  width: PropTypes.any,
  height: PropTypes.any,
  chart: PropTypes.PropTypes.object,
  config: PropTypes.object
};

StackedBarChart.defaultProps = {
  width: '100%',
  height: '300px'
};

export default StackedBarChart;
