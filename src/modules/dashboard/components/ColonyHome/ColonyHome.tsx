import React from 'react';
import { defineMessages } from 'react-intl';
import { Redirect, Route, RouteChildrenProps, Switch } from 'react-router-dom';
import { parse as parseQS } from 'query-string';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useLoggedInUser } from '~data/helpers';
import { useColonyFromNameQuery } from '~data/index';
import ColonyNavigation from '~dashboard/ColonyNavigation';
import SubscribedColoniesList from '~dashboard/SubscribedColoniesList/SubscribedColoniesList';
import LoadingTemplate from '~pages/LoadingTemplate';
import ColonyMembers from '~dashboard/ColonyMembers';

import {
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_HOME_ROUTE,
  NOT_FOUND_ROUTE,
} from '~routes/index';
import { useTransformer } from '~utils/hooks';

import { getUserRolesForDomain } from '../../../transformers';

import ColonyFunding from './ColonyFunding';
import ColonyTitle from './ColonyTitle';
import ColonyTotalFunds from '../ColonyTotalFunds';
import ColonyActions from '../ColonyActions';

import styles from './ColonyHome.css';
import DomainDropdown from '~dashboard/DomainDropdown';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.Admin.loadingText',
    defaultMessage: 'Loading Colony',
  },
  tabContribute: {
    id: 'dashboard.ColonyHome.tabContribute',
    defaultMessage: 'Tasks',
  },
  tabSuggestions: {
    id: 'dashboard.ColonyHome.tabSuggestions',
    defaultMessage: 'Suggestions',
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
  const { walletAddress } = useLoggedInUser();

  const { domainFilter } = parseQS(location.search) as {
    domainFilter: string | undefined;
  };
  const filteredDomainId = domainFilter
    ? parseInt(domainFilter, 10) || COLONY_TOTAL_BALANCE_DOMAIN_ID
    : COLONY_TOTAL_BALANCE_DOMAIN_ID;

  const {
    data,
    error,
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

  const colonyDomains = data && data.colony && data.colony.domains;
  const reverseENSAddress = dataVariables && dataVariables.address;

  /*
   * @NOTE Disabled until we're done with domain filters to prevent lint errors
   * when pushing downstream rebased branches
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredDomain = colonyDomains
    ? colonyDomains.find(({ ethDomainId }) => ethDomainId === filteredDomainId)
    : undefined;

  /*
   * @NOTE Disabled until we're done with domain filters to prevent lint errors
   * when pushing downstream rebased branches
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentDomainUserRoles = useTransformer(getUserRolesForDomain, [
    data && data.colony,
    walletAddress,
    filteredDomainId || ROOT_DOMAIN_ID,
  ]);

  /*
   * @NOTE Disabled until we're done with domain filters to prevent lint errors
   * when pushing downstream rebased branches
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rootUserRoles = useTransformer(getUserRolesForDomain, [
    data && data.colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  if (!colonyName || (reverseENSAddress as any) instanceof Error) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!data || !data.colonyAddress || !data.colony) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const { colony } = data;

  return (
    <div className={styles.main}>
      <div className={styles.colonyList}>
        <SubscribedColoniesList />
      </div>
      <div className={styles.mainContentGrid}>
        <aside className={styles.leftAside}>
          <ColonyTitle colony={colony} />
          <div className={styles.leftAsideNav}>
            <ColonyNavigation />
          </div>
        </aside>
        <div className={styles.mainContent}>
          <ColonyTotalFunds colony={colony} />
          <div className={styles.domainsDropdownContainer}>
            <DomainDropdown colonyAddress={colony.colonyAddress} />
          </div>
          <Switch>
            <Route path={COLONY_EVENTS_ROUTE} component={() => <>Events</>} />
            <Route
              path={COLONY_EXTENSIONS_ROUTE}
              component={() => <>Extensions</>}
            />
            <Route
              path={COLONY_HOME_ROUTE}
              component={() => <ColonyActions />}
            />
          </Switch>
        </div>
        <aside className={styles.rightAside}>
          <ColonyFunding colony={colony} currentDomainId={filteredDomainId} />
          <ColonyMembers colony={colony} />
        </aside>
      </div>
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
