import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect, Route, RouteChildrenProps, Switch } from 'react-router-dom';
import { parse as parseQS } from 'query-string';

import Alert from '~core/Alert';
import Button, { ActionButton } from '~core/Button';
import { useDialog } from '~core/Dialog';
import LoadingTemplate from '~pages/LoadingTemplate';
import ColonyNavigation from '~dashboard/ColonyNavigation';
import ColonyMembers from '~dashboard/ColonyHome/ColonyMembers';
import NetworkContractUpgradeDialog from '~dashboard/NetworkContractUpgradeDialog';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyFromNameQuery, useNetworkContracts } from '~data/index';
import { useLoggedInUser } from '~data/helpers';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '../../../transformers';
import { hasRoot, canEnterRecoveryMode } from '../../../users/checks';
import { canBeUpgraded } from '../../checks';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';

import {
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_HOME_ROUTE,
  NOT_FOUND_ROUTE,
} from '~routes/index';

import ColonyFunding from './ColonyFunding';
import ColonyTitle from './ColonyTitle';
import ColonyDomainDescription from './ColonyDomainDescription';
import ColonyTotalFunds from '../ColonyTotalFunds';
import ColonyActions from '../ColonyActions';
import ColonyEvents from '../ColonyEvents';

import styles from './ColonyHome.css';
import DomainDropdown from '~dashboard/DomainDropdown';
import ColonyHomeActions from '~dashboard/ColonyHomeActions';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.ColonyHome.loadingText',
    defaultMessage: 'Loading Colony',
  },
  tabContribute: {
    id: 'dashboard.ColonyHome.tabContribute',
    defaultMessage: 'Tasks',
  },
  tabTransactions: {
    id: 'dashboard.ColonyHome.tabTransactions',
    defaultMessage: 'Transactions',
  },
  tabCommunity: {
    id: 'dashboard.ColonyHome.tabCommunity',
    defaultMessage: 'Community',
  },
  noFilter: {
    id: 'dashboard.ColonyHome.noFilter',
    defaultMessage: 'All Transactions in Colony',
  },
  upgradeRequired: {
    id: `dashboard.ColonyHome.upgradeRequired`,
    defaultMessage: `This colony uses a version of the network that is no
      longer supported. You must upgrade to continue using this application.`,
  },
  deploymentNotFinished: {
    id: `dashboard.ColonyHome.deploymentNotFinished`,
    defaultMessage: `Colony creation incomplete. Click to continue 👉`,
  },
  buttonFinishDeployment: {
    id: `dashboard.ColonyHome.buttonFinishDeployment`,
    defaultMessage: `Finish Deployment`,
  },
});

type Props = RouteChildrenProps<{ colonyName: string }>;

const displayName = 'dashboard.ColonyHome';

const ColonyHome = ({ match, location }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }
  const { colonyName } = match.params;
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const { version: networkVersion } = useNetworkContracts();
  const openUpgradeVersionDialog = useDialog(NetworkContractUpgradeDialog);

  const { domainFilter: queryDomainFilterId } = parseQS(location.search) as {
    domainFilter: string | undefined;
  };

  const [domainIdFilter, setDomainIdFilter] = useState<number>(
    Number(queryDomainFilterId),
  );

  const filteredDomainId = domainIdFilter || COLONY_TOTAL_BALANCE_DOMAIN_ID;

  const { data, error, loading } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  if (error) console.error(error);

  const allUserRoles = useTransformer(getAllUserRoles, [
    data?.processedColony,
    walletAddress,
  ]);

  const handleUpgradeColony = useCallback(() => {
    if (!data || !data.processedColony) {
      return;
    }
    openUpgradeVersionDialog({
      colony: data.processedColony,
    });
  }, [data, openUpgradeVersionDialog]);

  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress: data?.colonyAddress,
    })),
    [data],
  );

  /*
   * Keep the page loaded when the colony name changes, but we have data
   *
   * This can happen if changing the colony from the left subscriptions sidebar
   * The data won't change, hence not trigger the "loading" check, until it is
   * fetched and refreshed in the background.
   *
   * What this looks like in practice is that you change the colony but you'll
   * see the "old" colony's data on the page, up until it is just changed in
   * front of you.
   *
   * This problem is made even worse in an production environment where loading
   * times are slow.
   */
  if (loading || data?.processedColony?.colonyName !== colonyName) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colonyName || error || !data?.processedColony) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  const {
    processedColony: colony,
    processedColony: { isDeploymentFinished },
  } = data;

  const hasRegisteredProfile = !!username && !ethereal;
  const canUpgradeColony = hasRegisteredProfile && hasRoot(allUserRoles);
  const canFinishDeployment =
    canUpgradeColony && canEnterRecoveryMode(allUserRoles);
  /*
   * @NOTE As a future upgrade, we can have a mapping where we keep track of
   * past and current network versions so that we can control, more granularly,
   * which versions *must* be upgraded, and which can function as-is, even with
   * an older version
   */
  const mustUpgradeColony = canBeUpgraded(
    colony,
    parseInt(networkVersion || '0', 10),
  );

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        <aside className={styles.leftAside}>
          <ColonyTitle colony={colony} />
          <div className={styles.leftAsideNav}>
            <ColonyNavigation />
          </div>
        </aside>
        <div className={styles.mainContent}>
          <ColonyTotalFunds colony={colony} />
          <div className={styles.contentActionsPanel}>
            <div className={styles.domainsDropdownContainer}>
              <DomainDropdown
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                colony={colony}
              />
            </div>
            <ColonyHomeActions colony={colony} />
          </div>
          <Switch>
            <Route
              path={COLONY_EVENTS_ROUTE}
              component={() => (
                <ColonyEvents colony={colony} ethDomainId={domainIdFilter} />
              )}
            />
            <Route
              path={COLONY_EXTENSIONS_ROUTE}
              component={() => <>Extensions</>}
            />
            <Route
              path={COLONY_HOME_ROUTE}
              component={() => (
                <ColonyActions colony={colony} ethDomainId={domainIdFilter} />
              )}
            />
          </Switch>
        </div>
        <aside className={styles.rightAside}>
          <ColonyDomainDescription
            colony={colony}
            currentDomainId={filteredDomainId}
          />
          <ColonyFunding colony={colony} currentDomainId={filteredDomainId} />
          <ColonyMembers colony={colony} currentDomainId={filteredDomainId} />
        </aside>
      </div>
      {!!mustUpgradeColony && (
        <div className={styles.upgradeBannerContainer}>
          <Alert
            appearance={{
              theme: 'danger',
              margin: 'none',
              borderRadius: 'none',
            }}
          >
            <div className={styles.upgradeBanner}>
              <FormattedMessage {...MSG.upgradeRequired} />
            </div>
            <Button
              appearance={{ theme: 'primary', size: 'medium' }}
              text={{ id: 'button.upgrade' }}
              onClick={handleUpgradeColony}
              disabled={!canUpgradeColony}
            />
          </Alert>
        </div>
      )}
      {!mustUpgradeColony && !isDeploymentFinished && canFinishDeployment && (
        <div className={styles.upgradeBannerContainer}>
          <Alert
            appearance={{
              theme: 'danger',
              margin: 'none',
              borderRadius: 'none',
            }}
          >
            <div className={styles.upgradeBanner}>
              <FormattedMessage {...MSG.deploymentNotFinished} />
            </div>
            <ActionButton
              appearance={{ theme: 'primary', size: 'medium' }}
              text={MSG.buttonFinishDeployment}
              submit={ActionTypes.COLONY_DEPLOYMENT_RESTART}
              error={ActionTypes.COLONY_DEPLOYMENT_RESTART_ERROR}
              success={ActionTypes.COLONY_DEPLOYMENT_RESTART_SUCCESS}
              transform={transform}
              disabled={!canFinishDeployment}
            />
          </Alert>
        </div>
      )}
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
