/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import Heading from '~core/Heading';

import { COLONY_HOME_ROUTE } from '~routes';

import VerticalNavigation from '~pages/VerticalNavigation';

import Profile from '~admin/Profile';
import Organizations from '~admin/Organizations';
import Tokens from '~admin/Tokens';

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
    defaultMessage: 'Transaction',
  },
  tabOrganisation: {
    id: 'dashboard.Admin.tabOrganisation',
    defaultMessage: 'Organisation',
  },
});

type Props = {
  /*
   * This will most likely come from the redux state
   * The most obvious way to achieve this is to enhance this component with
   * a connect call
   */
  colonyName?: string,
};

const navigationItems: Array<NavigationItem> = [
  {
    title: MSG.tabProfile,
    content: <Profile />,
  },
  {
    title: MSG.tabTokens,
    content: <Tokens />,
  },
  {
    title: MSG.tabTransaction,
    content: <div>Transaction Content</div>,
  },
  {
    title: MSG.tabOrganisation,
    content: <Organizations />,
  },
];

const displayName = 'admin.AdminDashboard';

const AdminDashboard = ({ colonyName = 'The Meta Colony' }: Props) => (
  <div className={styles.main}>
    <VerticalNavigation navigationItems={navigationItems}>
      <div className={styles.backNavigation}>
        <Icon name="circle-back" title="back" appearance={{ size: 'medium' }} />
        <NavLink
          to={COLONY_HOME_ROUTE}
          text={MSG.backButton}
          textValues={{ colonyName }}
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

AdminDashboard.displayName = displayName;

export default AdminDashboard;
