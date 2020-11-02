import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { Redirect, Route, RouteChildrenProps, Switch } from 'react-router-dom';
import { parse as parseQS } from 'query-string';

import LoadingTemplate from '~pages/LoadingTemplate';
import ColonyNavigation from '~dashboard/ColonyNavigation';
import ColonyMembers from '~dashboard/ColonyHome/ColonyMembers';
import Extensions, { ExtensionDetails } from '~dashboard/Extensions';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyFromNameQuery } from '~data/index';

import {
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_HOME_ROUTE,
  NOT_FOUND_ROUTE,
} from '~routes/index';

import ColonyFunding from './ColonyFunding';
import ColonyTitle from './ColonyTitle';
import ColonyDomainDescription from './ColonyDomainDescription';
import ColonyTotalFunds from '../ColonyTotalFunds';
import ColonyActions from '../ColonyActions';
import ColonyEvents from '../ColonyEvents';
import ColonyUpgrade from './ColonyUpgrade';
import ColonyFinishDeployment from './ColonyFinishDeployment';

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

  if (error) console.error(error);

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
  if (
    loading ||
    (data?.processedColony && data.processedColony.colonyName !== colonyName)
  ) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (
    !colonyName ||
    error ||
    !data?.processedColony ||
    (data?.colonyAddress as any) instanceof Error
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  const { processedColony: colony } = data;

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
              render={(props) => (
                <Extensions {...props} colonyAddress={data.colonyAddress} />
              )}
            />
            <Route
              exact
              path={COLONY_EXTENSION_DETAILS_ROUTE}
              render={(props) => (
                <ExtensionDetails
                  {...props}
                  colonyAddress={data.colonyAddress}
                />
              )}
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
      <ColonyUpgrade colony={colony} />
      <ColonyFinishDeployment colony={colony} />
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
