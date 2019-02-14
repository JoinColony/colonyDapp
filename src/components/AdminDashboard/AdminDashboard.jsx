/* @flow */

import type { LocationShape } from 'react-router-dom';

import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~components/core/Heading';
import LoadingTemplate from '~components/pages/LoadingTemplate';
import Organizations from '~components/Organizations';
import Profile from '~components/Profile';
import RecoveryModeAlert from '~components/RecoveryModeAlert';
import Tokens from '~components/Tokens';
import Transactions from '~components/Transactions';
import VerticalNavigation from '~components/pages/VerticalNavigation';
import { HistoryNavigation } from '~components/pages/NavigationWrapper';

import styles from './AdminDashboard.css';

import type {
  /*
   * Again, the same trick of making prettier not suggest a fix that would
   * break the eslint rules, by just adding a comment
   */
  NavigationItem,
} from '~components/pages/VerticalNavigation/VerticalNavigation.jsx';
import type { ColonyType, DataType } from '~immutable';
import type { Given } from '~utils/hoc';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.Admin.loadingText',
    defaultMessage: 'Loading Colony',
  },
  backButton: {
    id: 'dashboard.Admin.backButton',
    defaultMessage: 'Go to {name}',
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

type Props = {|
  colony: ?DataType<ColonyType>,
  /*
   * The flow type for this exists
   * This location object  will allow opening a tab on initial render
   */
  location?: ?LocationShape,
  given: Given,
|};

const navigationItems = (colony: ColonyType): Array<NavigationItem> => [
  {
    id: 1,
    title: MSG.tabProfile,
    content: <Profile colony={colony} />,
  },
  {
    id: 2,
    title: MSG.tabTokens,
    content: <Tokens />,
  },
  {
    id: 3,
    title: MSG.tabTransaction,
    content: <Transactions ensName={colony.ensName} />,
  },
  {
    id: 4,
    title: MSG.tabOrganisation,
    content: <Organizations ensName={colony.ensName} />,
  },
];

const AdminDashboard = ({ colony, given, location }: Props) => {
  if (!colony || !colony.record)
    return <LoadingTemplate loadingText={MSG.loadingText} />;

  const { ensName, name } = colony.record;
  return (
    <div className={styles.main}>
      <VerticalNavigation
        navigationItems={navigationItems(colony.record)}
        initialTab={
          location && location.state && location.state.initialTab
            ? location.state.initialTab
            : 0
        }
      >
        <div className={styles.backNavigation}>
          <HistoryNavigation
            backRoute={`/colony/${ensName}`}
            backText={MSG.backButton}
            backTextValues={{ name }}
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
};

AdminDashboard.defaultProps = {
  colonyName: 'meta-colony',
  colonyLabel: 'The Meta Colony',
};

AdminDashboard.displayName = 'admin.AdminDashboard';

export default AdminDashboard;
