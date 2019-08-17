import { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { handleAnalytics } from 'utils/analytics';
import { isCountryIncluded } from 'app/utils';
import { getLocationParamUpdated } from 'utils/navigation';
import { europeSlug, europeanCountries } from 'app/data/european-countries';

import { actions as fetchActions } from 'pages/ndcs-enhancements';
import { actions as modalActions } from 'components/modal-metadata';

import Component from './ndcs-enhancements-viz-component';

import {
  getMapIndicator,
  getIndicatorsParsed,
  getPathsWithStyles,
  getISOCountries,
  getLinkToDataExplorer,
  summarizeIndicators,
  MAP_COLORS
} from './ndcs-enhancements-viz-selectors';

const actions = { ...fetchActions, ...modalActions };

const mapStateToProps = (state, { location }) => {
  const { data, loading } = state.ndcsEnhancements;
  const { countries } = state;
  const search = qs.parse(location.search);
  const ndcsEnhancementsWithSelection = {
    ...data,
    countries: countries.data,
    query: search.search,
    search
  };
  return {
    loading,
    query: ndcsEnhancementsWithSelection.query,
    paths: getPathsWithStyles(ndcsEnhancementsWithSelection),
    isoCountries: getISOCountries(ndcsEnhancementsWithSelection),
    indicator: getMapIndicator(ndcsEnhancementsWithSelection),
    indicators: getIndicatorsParsed(ndcsEnhancementsWithSelection),
    summaryData: summarizeIndicators(ndcsEnhancementsWithSelection),
    downloadLink: getLinkToDataExplorer(ndcsEnhancementsWithSelection),
    mapColors: MAP_COLORS
  };
};

class NDCSEnhancementsVizContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      geometryIdHover: null,
      country: null
    };
  }

  handleSearchChange = query => {
    this.updateUrlParam({ name: 'search', value: query });
  };

  componentWillMount() {
    this.props.fetchNDCSEnhancements();
  }

  getTooltipText() {
    const { geometryIdHover } = this.state;
    const { indicator, indicators } = this.props;
    if (!geometryIdHover || !indicator) return '';

    const isEuropeanCountry = europeanCountries.includes(geometryIdHover);
    const id = isEuropeanCountry ? europeSlug : geometryIdHover;

    const dateIndicator = indicators.find(
      indicator => indicator.value == 'ndce_date'
    );
    const statementIndicator = indicators.find(
      indicator => indicator.value == 'ndce_statement'
    );

    if (indicator.locations && indicator.locations[id]) {
      let tooltipTxt;
      switch (indicator.locations[id].label_slug) {
        case 'submitted_2020':
          tooltipTxt =
            'Submitted a 2020 NDC on ' +
            dateIndicator.locations[id].value +
            '.';
          break;
        case 'intend_2020':
          tooltipTxt =
            'Intends to Submit 2020 NDC \n\n' +
            statementIndicator.locations[id].value;
          break;
        case 'enhance_2020':
          tooltipTxt =
            'Intends to Enhance Ambition or Action \n' +
            statementIndicator.locations[id].value;
          break;
        default:
          break;
      }
      return tooltipTxt ? tooltipTxt + '\n\nLearn more in table below.' : '';
    } else {
      return '';
    }
  }

  handleCountryClick = geography => {
    const { isoCountries } = this.props;
    const iso = geography.properties && geography.properties.id;
    if (iso && isCountryIncluded(isoCountries, iso)) {
      this.props.history.push(`/ndcs/country/${iso}`);
      handleAnalytics(
        'NDC Content Map',
        'Use map to find country',
        geography.properties.name
      );
    }
  };

  handleCountryEnter = geography => {
    const iso = geography.properties && geography.properties.id;
    if (iso) this.setState({ geometryIdHover: iso });
    this.setState({ country: geography.properties });
  };

  handleSearchChange = query => {
    this.updateUrlParam({ name: 'search', value: query });
  };

  handleInfoClick = () => {
    this.props.setModalMetadata({
      customTitle: 'NDC Content',
      category: 'NDC Content Map',
      slugs: ['ndc_cw', 'ndc_wb', 'ndc_die'],
      open: true
    });
  };

  updateUrlParam(param, clear) {
    const { history, location } = this.props;
    history.replace(getLocationParamUpdated(location, param, clear));
  }

  render() {
    const tooltipTxt = this.getTooltipText();
    const { query } = this.props;
    const noContentMsg = query
      ? 'No results found'
      : 'There is no data for this indicator';
    return createElement(Component, {
      ...this.props,
      tooltipTxt,
      handleCountryClick: this.handleCountryClick,
      handleCountryEnter: this.handleCountryEnter,
      handleInfoClick: this.handleInfoClick,
      noContentMsg,
      handleSearchChange: this.handleSearchChange,
      indicator: this.props.indicator,
      countryData: this.state.country,
      summaryData: this.props.summaryData
    });
  }
}

NDCSEnhancementsVizContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isoCountries: PropTypes.array.isRequired,
  setModalMetadata: PropTypes.func.isRequired,
  fetchNDCSEnhancements: PropTypes.func.isRequired
};

export default withRouter(
  connect(mapStateToProps, actions)(NDCSEnhancementsVizContainer)
);
