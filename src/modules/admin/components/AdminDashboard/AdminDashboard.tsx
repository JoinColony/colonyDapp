import React from 'react';
import { Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { NavigationItem } from '~pages/VerticalNavigation/VerticalNavigation';
import Heading from '~core/Heading';
import LoadingTemplate from '~pages/LoadingTemplate';
import ProfileEdit from '~admin/Profile/ProfileEdit';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Tokens from '~admin/Tokens';
import Domains from '~admin/Domains';
import Permissions from '~admin/Permissions';
import ProfileAdvanced from '~admin/Profile/ProfileAdvanced';
import VerticalNavigation from '~pages/VerticalNavigation';
import { HistoryNavigation } from '~pages/NavigationWrapper';
import { useDataFetcher, useTransformer } from '~utils/hooks';
import { DomainsMapType } from '~types/index';
import {
  FullColonyFragment,
  useColonyFromNameQuery,
  useLoggedInUser,
} from '~data/index';
import { NOT_FOUND_ROUTE } from '~routes/index';

import {
  TEMP_getUserRolesWithRecovery,
  getAllUserRoles,
} from '../../../transformers';
import { canArchitect, hasRoot } from '../../../users/checks';
import {
  domainsAndRolesFetcher,
  TEMP_userHasRecoveryRoleFetcher,
} from '../../../dashboard/fetchers';

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
  tabAdvanced: {
    id: 'dashboard.Admin.tabAdvanced',
    defaultMessage: 'Advanced',
  },
});

interface Props {
  location: any;
  match: any;
}

const navigationItems = (
  colony: FullColonyFragment,
  domains: DomainsMapType,
  rootRoles: ROLES[],
  allRoles: ROLES[],
): NavigationItem[] => {
  const items = [] as NavigationItem[];

  if (hasRoot(rootRoles)) {
    items.push({
      id: 1,
      title: MSG.tabProfile,
      content: <ProfileEdit colony={colony} />,
    });
    items.push({
      id: 2,
      title: MSG.tabTokens,
      content: (
        <Tokens
          colonyAddress={colony.colonyAddress}
          canMintNativeToken={colony.canMintNativeToken}
          domains={domains}
          nativeTokenAddress={colony.nativeTokenAddress}
          rootRoles={rootRoles}
          tokenAddresses={colony.tokenAddresses}
        />
      ),
    });
  }

  if (canArchitect(allRoles)) {
    items.push({
      id: 3,
      title: MSG.tabDomains,
      content: (
        <Domains
          colonyAddress={colony.colonyAddress}
          domains={domains}
          rootRoles={rootRoles}
        />
      ),
    });
    items.push({
      id: 4,
      title: MSG.tabPermissions,
      content: (
        <Permissions colonyAddress={colony.colonyAddress} domains={domains} />
      ),
    });
  }

  if (hasRoot(rootRoles)) {
    items.push({
      id: 5,
      title: MSG.tabAdvanced,
      content: <ProfileAdvanced colony={colony} rootRoles={rootRoles} />,
    });
  }

  return items;
};

const AdminDashboard = ({
  location,
  match: {
    params: { colonyName },
  },
}: Props) => {
  const CURRENT_COLONY_ROUTE = colonyName ? `/colony/${colonyName}` : '';

  // @TODO: Try to get proper error handling going in resolvers (for colonies that don't exist)
  const { data, error: colonyFetchError } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  const { walletAddress } = useLoggedInUser();
  const colonyAddress = data && data.colonyAddress;

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const { data: colonyRecoveryRoles = [] } = useDataFetcher(
    TEMP_userHasRecoveryRoleFetcher,
    [colonyAddress],
    [colonyAddress, walletAddress],
  );

  const rootUserRoles = useTransformer(TEMP_getUserRolesWithRecovery, [
    domains,
    colonyRecoveryRoles,
    ROOT_DOMAIN,
    walletAddress,
  ]);

  const allUserRoles = useTransformer(getAllUserRoles, [
    domains,
    walletAddress,
  ]);

  if (!colonyName || colonyFetchError) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!data || !domains || isFetchingDomains) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!hasRoot(rootUserRoles) && !canArchitect(allUserRoles)) {
    return <Redirect to={CURRENT_COLONY_ROUTE} />;
  }

  const { colony } = data;

  return (
    <div className={styles.main}>
      <VerticalNavigation
        navigationItems={navigationItems(
          colony,
          domains,
          rootUserRoles,
          allUserRoles,
        )}
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
            backTextValues={{ displayName: colony.displayName }}
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
      {colony.isInRecoveryMode && <RecoveryModeAlert />}
    </div>
  );
};

AdminDashboard.defaultProps = {
  colonyName: 'meta-colony',
  colonyLabel: 'The Meta Colony',
};

AdminDashboard.displayName = 'admin.AdminDashboard';

export default AdminDashboard;
