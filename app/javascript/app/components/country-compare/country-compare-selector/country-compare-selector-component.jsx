import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import Dropdown from 'components/dropdown';
import cx from 'classnames';
import styles from './country-compare-selector-styles.scss';

const CountryCompareSelector = ({
  countryOptions,
  handleDropDownChange,
  activeCountryOptions,
  hideResetButton,
  selectors,
  className
}) => (
  <div className={styles.bottomBorder}>
    <div className={styles.selectorsLayout}>
      <div className={cx(styles.columns, className)}>
        {selectors.map((v, index) => (
          <Dropdown
            key={v.color}
            placeholder="Add a country"
            options={sortBy(countryOptions, ['label'])}
            onValueChange={selected => handleDropDownChange(index, selected)}
            value={activeCountryOptions[index]}
            transparent
            colorDot={v.country ? v.color : null}
            hideResetButton={hideResetButton}
          />
        ))}
      </div>
    </div>
  </div>
);

CountryCompareSelector.propTypes = {
  hideResetButton: PropTypes.bool,
  activeCountryOptions: PropTypes.array,
  selectors: PropTypes.array,
  countryOptions: PropTypes.array,
  handleDropDownChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default CountryCompareSelector;
