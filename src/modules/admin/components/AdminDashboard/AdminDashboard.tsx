import React from 'react';
import { Redirect } from 'react-router';
import { defineMessages } from 'react-intl';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { NavigationItem } from '~pages/VerticalNavigation/VerticalNavigation';
import { ColonyType } from '~immutable/index';
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
import { useLoggedInUser } from '~data/helpers';
import { useColonyQuery } from '~data/index';

import {
  TEMP_getUserRolesWithRecovery,
  getAllUserRoles,
} from '../../../transformers';
import { isInRecoveryMode } from '../../../dashboard/checks';
/*
 * @TODO Re-add domains once they're available from mongo
 *
 * import {
 *   canArchitect,
 *   hasRoot
 * } from '../../../users/checks';
 */
import {
  colonyAddressFetcher,
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

/*
 * @TODO Re-add domains once they're available from mongo
 */
const canArchitect = () => true;
const hasRoot = () => true;

const navigationItems = (
  colony: ColonyType,
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
          rootRoles={rootRoles}
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

  const { error: addressError, data: colonyAddress } = useDataFetcher(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );

  const {
    data: { colony },
  } = useColonyQuery({
    variables: { address: colonyAddress },
  });

  const { walletAddress } = useLoggedInUser();

  const { data: domains, isFetching: isFetchingRoles } = useDataFetcher(
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

  if (!colonyName || addressError) {
    return <Redirect to="/404" />;
  }

  if (
    !(colony && colony.colonyAddress)
    /*
     * @TODO Re-add domains once they're available from mongo
     */
    // !domains ||
    // isFetchingRoles ||
  ) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!hasRoot(rootUserRoles) && !canArchitect(allUserRoles)) {
    return <Redirect to={CURRENT_COLONY_ROUTE} />;
  }

  const { displayName } = colony;
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
