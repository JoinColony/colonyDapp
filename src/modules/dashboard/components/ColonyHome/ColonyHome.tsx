import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect, Route, RouteChildrenProps, Switch } from 'react-router-dom';
import { parse as parseQS } from 'query-string';

import Alert from '~core/Alert';
import Button from '~core/Button';
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
import { hasRoot } from '../../../users/checks';
import { canBeUpgraded } from '../../checks';

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
    id: 'dashboard.Admin.loadingText',
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

  const {
    data,
    error,
    loading,
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
    variables: dataVariables,
  } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  console.log('fetching error?', error)
  console.log('loading signal', loading)
  console.log('returned data', data)

  if (error) console.error(error);

  const reverseENSAddress = dataVariables && dataVariables.address;

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

  if (!colonyName || (reverseENSAddress as any) instanceof Error) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!data || !data.colonyAddress || !data.processedColony) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const { processedColony: colony } = data;

  const hasRegisteredProfile = !!username && !ethereal;
  const canUpgradeColony = hasRegisteredProfile && hasRoot(allUserRoles);
  /*
   * @NOTE As a future upgrade, we can have a mapping where we keep track of
   * past and current network versions so that we can control, more granularly,
   * which versions *must* be upgraded, and which can function as-is, even with
   * an older version
   */
  const mustUpgradeColony = canBeUpgraded(
    data.processedColony,
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
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
