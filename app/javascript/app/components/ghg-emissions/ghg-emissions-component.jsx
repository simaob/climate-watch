import React, { PureComponent } from 'react';
import ChartStackedArea from 'components/charts/stacked-area';

const ghgEmissionsSampleConfig = {
  axes: {
    xBottom: {
      name: 'Year',
      unit: 'date',
      format: 'YYYY'
    },
    yLeft: {
      name: 'Emissions',
      unit: 'MtCO2e',
      format: 'number'
    }
  },
  type: 'stackedArea',
  columns: {
    x: ['x'],
    y: ['yRussia', 'yChina', 'yEUR28']
  },
  theme: {
    yRussia: { fill: '#302463' },
    yChina: { fill: '#d5eaf7' },
    yEUR28: { fill: '#103d5c', stroke: '#113750' }
  }
};

const ghgEmissionsSampleData = [
  { x: 1970, yRussia: 2343, yChina: 2400, yEUR28: 2452 },
  { x: 1975, yRussia: 2432, yChina: 2345, yEUR28: 1234 },
  { x: 1980, yRussia: 5321, yChina: 3453, yEUR28: 5321 },
  { x: 1985, yRussia: 4000, yChina: 2313, yEUR28: 1342 },
  { x: 1990, yRussia: 2345, yChina: 2400, yEUR28: 2400 },
  { x: 1995, yRussia: 3000, yChina: 1398, yEUR28: 2210 },
  { x: 2000, yRussia: 2000, yChina: 9800, yEUR28: 2290 },
  { x: 2005, yRussia: 2780, yChina: 3908, yEUR28: 2000 },
  { x: 2010, yRussia: 1890, yChina: 4800, yEUR28: 2181 },
  { x: 2015, yRussia: 2390, yChina: 3800, yEUR28: 2500 },
  { x: 2020, yRussia: 3490, yChina: 4300, yEUR28: 2100 }
];

// import styles from './GhgEmissions-styles.scss';

class GhgEmissions extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <ChartStackedArea
          config={ghgEmissionsSampleConfig}
          data={ghgEmissionsSampleData}
        />
      </div>
    );
  }
}

GhgEmissions.propTypes = {};

export default GhgEmissions;