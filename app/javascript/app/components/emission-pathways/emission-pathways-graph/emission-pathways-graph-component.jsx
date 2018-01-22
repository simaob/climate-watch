import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EspLocationsProvider from 'providers/esp-locations-provider';
import EspIndicatorsProvider from 'providers/esp-indicators-provider';
import EspTimeSeriesProvider from 'providers/esp-time-series-provider';
import ButtonGroup from 'components/button-group';
import ModalOverview from 'components/modal-overview';
import Dropdown from 'components/dropdown';
import Chart from 'components/charts/chart';

import layout from 'styles/layout.scss';
import styles from './emission-pathways-graph-styles.scss';

class EmissionPathwayGraph extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      data,
      config,
      loading,
      filtersLoading,
      filtersOptions,
      filtersSelected,
      handleSelectorChange,
      handleInfoClick,
      modalData,
      handleModelChange
    } = this.props;
    const needsTimeSeries =
      filtersSelected && filtersSelected.location && filtersSelected.model;
    const filtersDisabled =
      filtersLoading.indicators ||
      filtersLoading.timeseries ||
      filtersLoading.models;
    return (
      <div className={styles.wrapper}>
        <div className={layout.content}>
          <EspIndicatorsProvider />
          <EspLocationsProvider withTimeSeries />
          {needsTimeSeries && (
            <EspTimeSeriesProvider
              location={filtersSelected.location.value}
              model={filtersSelected.model.value}
            />
          )}
          <div className={styles.col4}>
            <h2 className={styles.title}>Emission Pathways</h2>
            <ButtonGroup
              className={styles.colEnd}
              onInfoClick={handleInfoClick}
              shareUrl="/embed/emission-pathway-graph"
              analyticsGraphName="Emission pathway"
            />
          </div>
          <div className={styles.col4}>
            <Dropdown
              label="Country/Region"
              options={filtersOptions.locations}
              onValueChange={option =>
                handleSelectorChange(option, 'currentLocation')}
              value={filtersSelected.location}
              hideResetButton
            />
            <Dropdown
              label="Model"
              options={filtersOptions.models}
              onValueChange={handleModelChange}
              value={filtersSelected.model}
              hideResetButton
            />
            <Dropdown
              label="Category"
              placeholder="Select a category"
              options={filtersOptions.category}
              hideResetButton
              disabled={filtersDisabled}
              onValueChange={option => handleSelectorChange(option, 'category')}
              value={filtersSelected.category}
            />
            <Dropdown
              label="Subcategory"
              placeholder="Select a subcategory"
              options={filtersOptions.subcategory}
              hideResetButton
              disabled={filtersDisabled}
              onValueChange={option =>
                handleSelectorChange(option, 'subcategory')}
              value={filtersSelected.subcategory}
            />
            <Dropdown
              label="Indicator"
              placeholder="Select an indicator"
              options={filtersOptions.indicators}
              hideResetButton
              disabled={filtersDisabled}
              onValueChange={option =>
                handleSelectorChange(option, 'indicator')}
              value={filtersSelected.indicator}
            />
          </div>
          <Chart
            className={styles.chartWrapper}
            type="line"
            config={config}
            data={data}
            dataOptions={filtersOptions.scenarios}
            dataSelected={filtersSelected.scenarios}
            customMessage={'No data available for that indicator'}
            height={500}
            loading={loading}
            targetParam="scenario"
            forceTwoDecimals
          />
          <ModalOverview
            data={modalData}
            title={'Emission Pathways Metadata'}
            tabTitles={[
              'Model',
              'Scenarios',
              filtersSelected.indicator ? 'Indicator' : null
            ]}
          />
        </div>
      </div>
    );
  }
}

EmissionPathwayGraph.propTypes = {
  data: PropTypes.array,
  modalData: PropTypes.array,
  config: PropTypes.object,
  loading: PropTypes.bool,
  filtersLoading: PropTypes.object,
  filtersOptions: PropTypes.object,
  filtersSelected: PropTypes.object,
  handleSelectorChange: PropTypes.func,
  handleInfoClick: PropTypes.func,
  handleModelChange: PropTypes.func
};

export default EmissionPathwayGraph;
