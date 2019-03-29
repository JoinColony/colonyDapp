/* @flow */

import type { LocationShape, Match } from 'react-router-dom';

import React from 'react';
import { Redirect } from 'react-router';
import { defineMessages } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';

import Heading from '~core/Heading';
import LoadingTemplate from '~pages/LoadingTemplate';
import Organizations from '~admin/Organizations';
import Profile from '~admin/Profile';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Tokens from '~admin/Tokens';
import Transactions from '~admin/Transactions';
import VerticalNavigation from '~pages/VerticalNavigation';
import { HistoryNavigation } from '~pages/NavigationWrapper';

import { colonyFetcher } from '../../../dashboard/fetchers';
import { isInRecoveryMode } from '../../../dashboard/checks';

import styles from './AdminDashboard.css';

import type { NavigationItem } from '~pages/VerticalNavigation/VerticalNavigation.jsx';
import type { ColonyType } from '~immutable';

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

type Props = {|
  /*
   * The flow type for this exists
   * This location object  will allow opening a tab on initial render
   */
  location: LocationShape,
  match: Match,
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
    content: <Tokens tokens={colony.tokens} />,
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

const AdminDashboard = ({
  location,
  match: {
    params: { ensName },
  },
}: Props) => {
  const { data: colony, isFetching, error } = useDataFetcher<ColonyType>(
    colonyFetcher,
    [ensName],
    [ensName],
  );

  if (!ensName || error) {
    return <Redirect to="/404" />;
  }

  if (!colony || isFetching) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const { name } = colony;
  return (
    <div className={styles.main}>
      <VerticalNavigation
        navigationItems={navigationItems(colony)}
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
      {isInRecoveryMode(colony) && <RecoveryModeAlert />}
    </div>
  );
};

AdminDashboard.defaultProps = {
  colonyName: 'meta-colony',
  colonyLabel: 'The Meta Colony',
};

AdminDashboard.displayName = 'admin.AdminDashboard';

export default AdminDashboard;
