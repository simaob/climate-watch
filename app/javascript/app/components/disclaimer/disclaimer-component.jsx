import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import Icon from 'components/icon';
import closeIcon from 'assets/icons/sidebar-close.svg';
import cx from 'classnames';
import styles from './disclaimer-styles.scss';

class Disclaimer extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      handleOnRequestClose,
      hasBeenShown,
      className,
      onlyText
    } = this.props;
    return onlyText || !hasBeenShown ? (
      <div className="grid-column-item">
        <div
          className={cx(
            styles.disclaimerBox,
            { [styles.onlyText]: onlyText },
            className
          )}
        >
          <div className={cx({ [styles.disclaimerLayout]: !onlyText })}>
            <div className={styles.firstText}>
              Please note that the level of emissions in future years are
              estimated based on greenhouse gas reduction targets communicated
              by countries, which might differ from historical emissions
              presented in terms of source, sector and gas coverage, GWP values
              and inventory methodologies used. The data are presented on the
              same chart for illustration only and should be treated with
              caution.
            </div>
            <div className={styles.secondText}>
              For detailed methodology and data sources used, please refer to
              WRI’s publication{' '}
              <a
                className={styles.link}
                href="https://www.wri.org/sites/default/files/Translating_Targets_into_Numbers.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Translating Targets into Numbers: Quantifying the Greenhouse Gas
                Targets of the G20 Countries for G20 countries, and UNEP’s
                Pledge Pipeline for other countries.
              </a>
            </div>
            {!onlyText && (
              <Button
                className={styles.closeButton}
                onClick={handleOnRequestClose}
                noBox
              >
                <Icon icon={closeIcon} className={styles.close} />
              </Button>
            )}
          </div>
        </div>
      </div>
    ) : null;
  }
}

Disclaimer.propTypes = {
  hasBeenShown: PropTypes.bool,
  onlyText: PropTypes.bool,
  handleOnRequestClose: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Disclaimer;
