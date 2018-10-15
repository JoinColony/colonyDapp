/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import VerticalNavigation from '~core/VerticalNavigation';
import Heading from '~core/Heading';

import styles from './Admin.css';

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

const displayName = 'admin.AdminDashboard';

const navigationItems: Array<Object> = [
  {
    name: MSG.tabProfile,
    content: <div>Profile Content</div>,
  },
  {
    name: MSG.tabTokens,
    content: <div>Tokens Content</div>,
  },
  {
    name: MSG.tabTransaction,
    content: <div>Transaction Content</div>,
  },
  {
    name: MSG.tabOrganisation,
    content: <div>Organisation Content</div>,
  },
];

const AdminDashboard = ({ colonyName = 'The Meta Colony' }: Props) => (
  <div className={styles.main}>
    <VerticalNavigation navigationItems={navigationItems}>
      <div className={styles.backNavigation}>
        <Icon name="back" title="back" appearance={{ size: 'medium' }} />
        <NavLink
          to="/colony"
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
