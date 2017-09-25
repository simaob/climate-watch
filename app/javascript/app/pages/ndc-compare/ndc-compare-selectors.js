import { createSelector } from 'reselect';
import compact from 'lodash/compact';

const getCountries = state => (state.data ? state.data : []);
const getLocations = state => (state.locations ? state.locations : []);
const getIso = state => state.iso;
const getAllIndicators = state => (state.data ? state.data.indicators : {});
const getCategories = state => (state.data ? state.data.categories : {});

const getCountryByIso = (countries, iso) =>
  countries.find(country => country.iso_code3 === iso);

export const getActiveCountries = createSelector(
  [getCountries, getLocations],
  (countries, locations) => {
    const activeCountries = locations.map(location => {
      if (parseInt(location, 10)) return null;
      const countryDetail = countries.find(
        country => country.iso_code3 === location
      );
      return {
        label: countryDetail.wri_standard_name,
        value: countryDetail.iso_code3
      };
    });
    return activeCountries;
  }
);

export const getCountriesOptions = createSelector([getCountries], countries =>
  countries.map(country => ({
    label: country.wri_standard_name,
    value: country.iso_code3
  }))
);

export const getCountriesOptionsFiltered = createSelector(
  [getCountriesOptions, getActiveCountries],
  (countries, activeCountries) => {
    const activeCountriesISOs = compact(activeCountries).map(
      activeCountry => activeCountry.value
    );
    return countries.filter(
      country => activeCountriesISOs.indexOf(country.value) === -1
    );
  }
);

export const getIndicators = createSelector(
  getAllIndicators,
  data => data || []
);

export const parseIndicatorsDefs = createSelector(
  [getAllIndicators, getCategories, getLocations],
  (indicators, categories, countries) => {
    if (!indicators || !categories || !countries) return {};
    const parsedIndicators = {};
    Object.keys(categories).forEach(category => {
      const categoryIndicators = indicators.filter(
        indicator => indicator.category_ids.indexOf(parseInt(category, 10)) > -1
      );
      const parsedDefinitions = categoryIndicators.map(def => {
        const descriptions = countries.map(country => ({
          iso: country,
          value: def.locations[country] ? def.locations[country].value : null
        }));
        return {
          title: def.name,
          slug: def.slug,
          descriptions
        };
      });
      parsedIndicators[category] = parsedDefinitions;
    });
    return parsedIndicators;
  }
);

export const getNDCs = createSelector(
  [getCategories, parseIndicatorsDefs],
  (categories, indicators) => {
    if (!categories) return [];
    const ndcs = Object.keys(categories).map(category => ({
      title: categories[category].name,
      slug: categories[category].slug,
      definitions: indicators[category] ? indicators[category] : []
    }));
    return ndcs;
  }
);

export const getCountry = createSelector(
  [getCountries, getIso],
  getCountryByIso
);

export default {
  getCountry,
  getCountriesOptions,
  getCountriesOptionsFiltered,
  getActiveCountries,
  getNDCs
};
