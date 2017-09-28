import { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import qs from 'query-string';
import { getLocationParamUpdated } from 'utils/navigation';
import isEqual from 'lodash/isEqual';

import {
  getChartData,
  getChartConfig,
  getSourceOptions,
  getSourceSelected,
  getBreaksByOptions,
  getBreakSelected,
  getFilterOptions,
  getFiltersSelected
} from './ghg-emissions-selectors';

import GhgEmissionsComponent from './ghg-emissions-component';
import actions from './ghg-emissions-actions';

const mapStateToProps = (state, { location }) => {
  const { meta, data } = state.ghgEmissions;
  const { data: regions } = state.regions;
  const search = qs.parse(location.search);
  const ghg = {
    meta,
    data,
    regions,
    search
  };
  return {
    data: getChartData(ghg),
    config: getChartConfig(ghg),
    sources: getSourceOptions(ghg),
    sourceSelected: getSourceSelected(ghg),
    breaksBy: getBreaksByOptions(ghg),
    breakSelected: getBreakSelected(ghg),
    filters: getFilterOptions(ghg),
    filtersSelected: getFiltersSelected(ghg)
  };
};

function needsRequestData(props, nextProps) {
  const { sourceSelected, breakSelected, filtersSelected } = nextProps;
  const hasValues =
    sourceSelected.value && breakSelected.value && filtersSelected;
  const hasChanged =
    sourceSelected.value !== props.sourceSelected.value ||
    breakSelected.value !== props.breakSelected.value ||
    !isEqual(filtersSelected.value, props.filtersSelected.value);
  return hasValues && hasChanged;
}

const TOP_EMITTERS = [
  'CHN',
  'USA',
  'EU28',
  'IND',
  'RUS',
  'JPN',
  'BRA',
  'IDN',
  'CAN',
  'MEX'
];

function getFiltersParsed(props) {
  const { sourceSelected, breakSelected, filtersSelected, location } = props;
  const search = qs.parse(location.search);
  const filter = {};
  // we need to request default value for other indicators
  const filtersSelectedValues = filtersSelected.map(
    d => (breakSelected.value === 'location' ? d.label : d.value)
  );

  switch (breakSelected.value) {
    case 'gas':
      filter.location = 'WORLD';
      filter.sector = 1;
      filter.gas = filtersSelectedValues.toString();
      break;
    case 'location':
      filter.gas = 1;
      filter.sector = 1;
      filter.location = search.filter
        ? filtersSelectedValues.toString()
        : TOP_EMITTERS.toString();
      break;
    case 'sector':
      filter.gas = 1;
      filter.location = 'WORLD';
      filter.sector = filtersSelectedValues.toString();
      break;
    default:
      break;
  }

  return {
    ...filter,
    source: sourceSelected.value
  };
}

class GhgEmissionsContainer extends PureComponent {
  componentDidMount() {
    const { fetchGhgEmissionsMeta } = this.props;
    fetchGhgEmissionsMeta();
  }

  componentWillReceiveProps(nextProps) {
    if (needsRequestData(this.props, nextProps)) {
      const { fetchGhgEmissionsData } = nextProps;
      const filters = getFiltersParsed(nextProps);
      fetchGhgEmissionsData(filters);
    }
  }

  handleSourceChange = category => {
    this.updateUrlParam({ name: 'source', value: category.value });
  };

  handleBreakByChange = breakBy => {
    this.updateUrlParam({ name: 'breakBy', value: breakBy.value });
  };

  handleFilterChange = filters => {
    const filtersParam = filters.map(filter => filter.value);
    this.updateUrlParam({ name: 'filter', value: filtersParam.toString() });
  };

  updateUrlParam(param) {
    const { history, location } = this.props;
    history.replace(getLocationParamUpdated(location, param));
  }

  handleRemoveTag = tagData => {
    const { filtersSelected } = this.props;
    const newFilters = [];
    filtersSelected.forEach(filter => {
      if (filter.label !== tagData.label) {
        newFilters.push(filter.value);
      }
    });
    this.updateUrlParam({ name: 'filter', value: newFilters.toString() });
  };

  render() {
    return createElement(GhgEmissionsComponent, {
      ...this.props,
      handleSourceChange: this.handleSourceChange,
      handleBreakByChange: this.handleBreakByChange,
      handleFilterChange: this.handleFilterChange,
      handleRemoveTag: this.handleRemoveTag
    });
  }
}

GhgEmissionsContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  fetchGhgEmissionsMeta: PropTypes.func.isRequired,
  fetchGhgEmissionsData: PropTypes.func.isRequired,
  filtersSelected: PropTypes.array
};

export { default as component } from './ghg-emissions-component';
export { initialState } from './ghg-emissions-reducers';
export { default as reducers } from './ghg-emissions-reducers';
export { default as styles } from './ghg-emissions-styles';
export { default as actions } from './ghg-emissions-actions';

export default withRouter(
  connect(mapStateToProps, actions)(GhgEmissionsContainer)
);
