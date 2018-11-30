/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { connect } from 'react-redux';

import type { LocationShape } from 'react-router-dom';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import Heading from '~core/Heading';

import { COLONY_HOME_ROUTE } from '~routes';

import VerticalNavigation from '~pages/VerticalNavigation';

import Profile from '~admin/Profile';
import Organizations from '~admin/Organizations';
import Tokens from '~admin/Tokens';
import Transactions from '~admin/Transactions';

import styles from './AdminDashboard.css';

import type {
  /*
   * Again, the same trick of making prettier not suggest a fix that would
   * break the eslint rules, by just adding a comment
   */
  NavigationItem,
} from '~pages/VerticalNavigation/VerticalNavigation.jsx';

const MSG = defineMessages({
  backButton: {
    id: 'dashboard.Admin.backButton',
    defaultMessage: 'Go to {colonyName}',
  },
  colonySettings: {
    id: 'dashboard.Admin.colonySettings',
    defaultMessage: 'Colony Settings',
  },
  tabProfile: {
    id: 'dashboard.Admin.tabProfile',
    defaultMessage: 'Profile',
  },
  tabTokens: {
    id: 'dashboard.Admin.tabTokens',
    defaultMessage: 'Tokens',
  },
  tabTransaction: {
    id: 'dashboard.Admin.tabTransaction',
    defaultMessage: 'Transactions',
  },
  tabOrganisation: {
    id: 'dashboard.Admin.tabOrganisation',
    defaultMessage: 'Organisation',
  },
});

type Props = {
  colonyLabel: string,
  colonyName: string,
  /*
   * The flow type for this exists
   * This location object  will allow opening a tab on initial render
   */
  location?: ?LocationShape,
};

const navigationItems: Array<NavigationItem> = [
  {
    id: 1,
    title: MSG.tabProfile,
    content: <Profile />,
  },
  {
    id: 2,
    title: MSG.tabTokens,
    content: <Tokens />,
  },
  {
    id: 3,
    title: MSG.tabTransaction,
    content: <Transactions />,
  },
  {
    id: 4,
    title: MSG.tabOrganisation,
    content: <Organizations />,
  },
];

const AdminDashboard = ({ colonyName, colonyLabel, location }: Props) => (
  <div className={styles.main}>
    <VerticalNavigation
      navigationItems={navigationItems}
      initialTab={
        location && location.state && location.state.initialTab ? 1 : 0
      }
    >
      <div className={styles.backNavigation}>
        <Icon name="circle-back" title="back" appearance={{ size: 'medium' }} />
        <NavLink
          to={`colony/${colonyName}`}
          text={MSG.backButton}
          textValues={{ colonyLabel }}
        />
      </div>
      <div className={styles.headingWrapper}>
        <Heading
          appearance={{
            size: 'normal',
            weight: 'medium',
            margin: 'small',
            theme: 'dark',
          }}
          text={MSG.colonySettings}
        />
      </div>
    </VerticalNavigation>
  </div>
);

AdminDashboard.defaultProps = {
  colonyName: 'meta-colony',
  colonyLabel: 'The Meta Colony',
};

AdminDashboard.displayName = 'admin.AdminDashboard';

// FIXME use selectors
export default connect(
  ({ router: { location, props: { colonyName } = {} } }, props) => ({
    ...props,
    location,
    colonyName,
    // FIXME add colonyName
  }),
  null,
)(AdminDashboard);
