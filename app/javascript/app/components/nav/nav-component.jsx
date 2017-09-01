import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import Icon from 'components/icon';
import ToolsNav from 'components/tools-nav';
import CountriesSelect from 'components/countries-select';

import cwLogo from 'assets/icons/cw-logo.svg';
import layout from 'styles/layout.scss';
import styles from './nav-styles.scss';

class NavBar extends PureComponent {
  render() {
    const { countriesOpen, setCountriesVisibility, location } = this.props;
    return (
      <div className={layout.content}>
        <nav className={styles.navbar}>
          {location.pathname !== '/' &&
            <NavLink exact className={styles.link} to="/">
              <Icon className={styles.logo} icon={cwLogo} />
            </NavLink>}
          <div
            className={styles.linkWrapper}
            onMouseEnter={() => setCountriesVisibility(true)}
            onMouseLeave={() => setCountriesVisibility(false)}
          >
            <NavLink
              className={styles.link}
              activeClassName={styles.linkActive}
              to="/countries"
            >
              COUNTRIES
            </NavLink>
            <div
              className={cx(styles.subMenu, {
                [styles.subMenuOpen]: countriesOpen
              })}
            >
              <CountriesSelect />
            </div>
          </div>
          <NavLink
            className={styles.link}
            activeClassName={styles.linkActive}
            to="/sectors"
          >
            SECTORS
          </NavLink>
          <NavLink
            className={styles.link}
            activeClassName={styles.linkActive}
            to="/ndcs"
          >
            NDCs
          </NavLink>
          <NavLink
            className={styles.link}
            activeClassName={styles.linkActive}
            to="/hgh"
          >
            GHG EMISSIONS
          </NavLink>
          <NavLink
            className={styles.link}
            activeClassName={styles.linkActive}
            to="/stories"
          >
            STORIES
          </NavLink>
          <NavLink
            className={styles.link}
            activeClassName={styles.linkActive}
            to="/about"
          >
            ABOUT
          </NavLink>
          <ToolsNav />
        </nav>
      </div>
    );
  }
}

NavBar.propTypes = {
  countriesOpen: Proptypes.bool,
  setCountriesVisibility: Proptypes.func.isRequired,
  location: Proptypes.object.isRequired
};

NavBar.defaultProps = {
  countriesOpen: false
};

export default NavBar;
