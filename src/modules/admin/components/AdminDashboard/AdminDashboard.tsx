import React from 'react';
import { Redirect } from 'react-router';
import { defineMessages } from 'react-intl';

import { NavigationItem } from '~pages/VerticalNavigation/VerticalNavigation';
import { ColonyType } from '~immutable/index';
import Heading from '~core/Heading';
import LoadingTemplate from '~pages/LoadingTemplate';
import Profile from '~admin/Profile';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Tokens from '~admin/Tokens';
import Transactions from '~admin/Transactions';
import Domains from '~admin/Domains';
import Permissions from '~admin/Permissions';
import VerticalNavigation from '~pages/VerticalNavigation';
import { HistoryNavigation } from '~pages/NavigationWrapper';
import {
  useDataFetcher,
  useDataSubscriber,
  useSelector,
  useUserDomainRoles,
} from '~utils/hooks';
import { Address } from '~types/index';

import { ROOT_DOMAIN } from '../../../core/constants';
import { isInRecoveryMode } from '../../../dashboard/checks';
import { canAdminister } from '../../../users/checks';
import { colonyAddressFetcher } from '../../../dashboard/fetchers';
import { colonySubscriber } from '../../../dashboard/subscribers';

import { walletAddressSelector } from '../../../users/selectors';

import styles from './AdminDashboard.css';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.Admin.loadingText',
    defaultMessage: 'Loading Colony',
  },
  backButton: {
    id: 'dashboard.Admin.backButton',
    defaultMessage: 'Go to {displayName}',
  },
  colonySettings: {
    id: 'dashboard.Admin.colonySettings',
    defaultMessage: 'Colony Settings',
  },
  tabDomains: {
    id: 'dashboard.Admin.tabDomains',
    defaultMessage: 'Domains',
  },
  tabPermissions: {
    id: 'dashboard.Admin.tabPermissions',
    defaultMessage: 'Permissions',
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
});

interface Props {
  location: any;
  match: any;
}

const navigationItems = (colony: ColonyType): NavigationItem[] => [
  {
    id: 1,
    title: MSG.tabProfile,
    content: <Profile colony={colony} />,
  },
  {
    id: 2,
    title: MSG.tabTokens,
    content: (
      <Tokens
        colonyAddress={colony.colonyAddress}
        canMintNativeToken={colony.canMintNativeToken}
      />
    ),
  },
  {
    id: 3,
    title: MSG.tabDomains,
    content: <Domains colonyAddress={colony.colonyAddress} />,
  },
  {
    id: 4,
    title: MSG.tabPermissions,
    content: <Permissions colonyAddress={colony.colonyAddress} />,
  },
  {
    id: 5,
    title: MSG.tabTransaction,
    content: <Transactions colonyAddress={colony.colonyAddress} />,
  },
];

const AdminDashboard = ({
  location,
  match: {
    params: { colonyName },
  },
}: Props) => {
  const CURRENT_COLONY_ROUTE = colonyName ? `/colony/${colonyName}` : '';

  const { error: addressError, data: colonyAddress } = useDataFetcher<Address>(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );

  const { error: colonyError, data: colony } = useDataSubscriber<ColonyType>(
    colonySubscriber,
    [colonyAddress],
    [colonyAddress],
  );

  const walletAddress = useSelector(walletAddressSelector);
  const { data: roles, isFetching: isFetchingRoles } = useUserDomainRoles(
    colony ? colony.colonyAddress : undefined,
    ROOT_DOMAIN,
    walletAddress,
  );

  if (!colonyName || addressError || colonyError) {
    return <Redirect to="/404" />;
  }

  if (!colony || !roles || isFetchingRoles) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!canAdminister(roles)) {
    return <Redirect to={CURRENT_COLONY_ROUTE} />;
  }

  const { displayName } = colony;
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
            backRoute={CURRENT_COLONY_ROUTE}
            backText={MSG.backButton}
            backTextValues={{ displayName }}
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
