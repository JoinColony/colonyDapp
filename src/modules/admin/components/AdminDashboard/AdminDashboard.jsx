/* @flow */

import type { LocationShape } from 'react-router-dom';

import React from 'react';
import { defineMessages } from 'react-intl';

import type { Given } from '~utils/hoc';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import Heading from '~core/Heading';

import { COLONY_HOME_ROUTE } from '~routes';

import VerticalNavigation from '~pages/VerticalNavigation';

import Profile from '~admin/Profile';
import Organizations from '~admin/Organizations';
import Tokens from '~admin/Tokens';
import Transactions from '~admin/Transactions';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';

import { withFeatureFlags } from '~utils/hoc';

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

const mockColonyRecoveryMode = true;

type Props = {
  /*
   * This will most likely come from the redux state
   * The most obvious way to achieve this is to enhance this component with
   * a connect call
   */
  colonyName?: string,
  /*
   * The flow type for this exists
   * This location object  will allow opening a tab on initial render
   */
  location?: ?LocationShape,
  given: Given,
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

const AdminDashboard = ({ colonyName, location, given }: Props) => (
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
    {/*
     * @TODO Replace with actual selector that checks if the Colony is in recovery mode
     */}
    {given(mockColonyRecoveryMode) && <RecoveryModeAlert />}
  </div>
);

AdminDashboard.defaultProps = {
  colonyName: 'The Meta Colony',
};

AdminDashboard.displayName = 'admin.AdminDashboard';

export default withFeatureFlags()(AdminDashboard);
