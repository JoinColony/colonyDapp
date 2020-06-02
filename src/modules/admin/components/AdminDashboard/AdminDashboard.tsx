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
import { useTransformer } from '~utils/hooks';
import { Colony, useColonyFromNameQuery, useLoggedInUser } from '~data/index';
import { NOT_FOUND_ROUTE } from '~routes/index';

import { getAllUserRoles, getUserRolesForDomain } from '../../../transformers';
import {
  canArchitect,
  hasRoot,
  canFund,
  canAdminister,
} from '../../../users/checks';

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
  colony: Colony,
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
    content: <Tokens colony={colony} />,
  };
  const domainsTab = {
    id: 3,
    title: MSG.tabDomains,
    content: <Domains colony={colony} />,
  };
  const advancedTab = {
    id: 5,
    title: MSG.tabAdvanced,
    content: <ProfileAdvanced colony={colony} />,
  };
  const permissionsTab = {
    id: 4,
    title: MSG.tabPermissions,
    content: <Permissions colony={colony} />,
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

  const { data: colonyData, error: colonyFetchError } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  const { walletAddress } = useLoggedInUser();

  const rootUserRoles = useTransformer(getUserRolesForDomain, [
    colonyData && colonyData.colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  const allUserRoles = useTransformer(getAllUserRoles, [
    colonyData && colonyData.colony,
    walletAddress,
  ]);

  if (!colonyName || colonyFetchError instanceof Error) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!colonyData) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  /*
   * @NOTE All roles require, in addition to the specific role, the administration
   * or the architecture role
   */
  if (!(canAdminister(rootUserRoles) || canArchitect(rootUserRoles))) {
    return <Redirect to={CURRENT_COLONY_ROUTE} />;
  }

  const { colony } = colonyData;

  return (
    <div className={styles.main}>
      <VerticalNavigation
        navigationItems={navigationItems(colony, rootUserRoles, allUserRoles)}
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
