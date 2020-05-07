import React from 'react';
import { Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';

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
import {
  canArchitect,
  hasRoot,
  canFund,
  canAdminister,
} from '../../../users/checks';
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
    defaultMessage: 'Back to {displayName}',
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
  rootRoles: ColonyRole[],
  allRoles: ColonyRole[],
): NavigationItem[] => {
  const items = [] as NavigationItem[];

  const profileTab = {
    id: 1,
    title: MSG.tabProfile,
    content: <ProfileEdit colony={colony} />,
  };
  const tokensTab = {
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
  };
  const domainsTab = {
    id: 3,
    title: MSG.tabDomains,
    content: (
      <Domains
        colonyAddress={colony.colonyAddress}
        domains={domains}
        rootRoles={rootRoles}
      />
    ),
  };
  const advancedTab = {
    id: 5,
    title: MSG.tabAdvanced,
    content: <ProfileAdvanced colony={colony} rootRoles={rootRoles} />,
  };
  const permissionsTab = {
    id: 4,
    title: MSG.tabPermissions,
    content: (
      <Permissions colonyAddress={colony.colonyAddress} domains={domains} />
    ),
  };

  /*
   * @NOTE Root role needs have access to the colony's management
   */
  if (hasRoot(rootRoles) || canAdminister(rootRoles)) {
    items.push(profileTab);
  }

  /*
   * @NOTE Architecture role can create new domains and change permissions
   * But what exact permissions can be changed is handled by the component
   */
  if (canArchitect(allRoles)) {
    items.push(domainsTab);
    items.push(permissionsTab);
  }

  /*
   * @NOTE Funding role can just transfer funds between *available* domains
   * It can't also mint more tokens, but that is being handled by the component itself
   */
  if (canFund(allRoles)) {
    items.push(tokensTab);
  }

  /*
   * @NOTE Root role needs have access to the colony's management
   * This needs to be the last call, so that we have the required tab sorting
   */
  if (hasRoot(rootRoles)) {
    items.push(advancedTab);
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

  const {
    data,
    /**
     * @NOTE Hooking into the return variable value
     *
     * Since this is a client side query it's return value will never end up
     * in the final result from the main query hook, either the value or the
     * eventual error.
     *
     * For this we hook into the `address` value which will be set internally
     * by the `@client` query so that we can act on it if we encounter an ENS
     * error.
     *
     * Based on that error we can determine if the colony is registered or not.
     */
    variables: { address: reverseENSAddress },
  } = useColonyFromNameQuery({
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
    ROOT_DOMAIN_ID,
    walletAddress,
  ]);

  const allUserRoles = useTransformer(getAllUserRoles, [
    domains,
    walletAddress,
  ]);

  if (!colonyName || (reverseENSAddress as any) instanceof Error) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!data || !domains || isFetchingDomains) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  /*
   * @NOTE All roles require, in addition to the specific role, the administration
   * or the architecture role
   */
  if (!(canAdminister(rootUserRoles) || canArchitect(rootUserRoles))) {
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
