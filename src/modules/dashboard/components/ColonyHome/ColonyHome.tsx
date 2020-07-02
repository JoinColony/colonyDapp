import React, { useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  Redirect,
  Route,
  RouteChildrenProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import { parse as parseQS } from 'query-string';

import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Transactions from '~admin/Transactions';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import { Tab, TabList, TabPanel, Tabs } from '~core/Tabs';
import CoinMachine from '~dashboard/CoinMachine';
import Community from '~dashboard/Community';
import LevelDashboard from '~dashboard/LevelDashboard';
import Program from '~dashboard/Program';
import Suggestions from '~dashboard/Suggestions';
import { useLoggedInUser } from '~data/helpers';
import { useColonyFromNameQuery } from '~data/index';
import LoadingTemplate from '~pages/LoadingTemplate';
import {
  NOT_FOUND_ROUTE,
  LEVEL_ROUTE,
  PROGRAM_ROUTE,
  COLONY_PURCHASE_TOKENS_ROUTE,
} from '~routes/index';
import { useDataFetcher, useTransformer } from '~utils/hooks';
import { capitalize } from '~utils/strings';

import { getUserRoles } from '../../../transformers';
import { canAdminister, hasRoot } from '../../../users/checks';
import { domainsAndRolesFetcher } from '../../fetchers';

import ColonyFunding from './ColonyFunding';
import styles from './ColonyHome.css';
import ColonyMeta from './ColonyMeta';
import TabContribute from './TabContribute';
import { getMainClasses } from '~utils/css';

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

/**
 * @NOTE These values need to appear in the order the actual tabs are rendered
 * as we use them to infer the default active tab
 */
enum TabName {
  TasksTab = 'tasks',
  SuggestionsTab = 'suggestions',
  CommunityTab = 'community',
  TransactionsTab = 'transactions',
}

type Props = RouteChildrenProps<{ colonyName: string }>;

const displayName = 'dashboard.ColonyHome';

const ColonyHome = ({ match, location }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }
  const { colonyName } = match.params;
  const { walletAddress, username } = useLoggedInUser();
  const isCoinMachine = useRouteMatch(COLONY_PURCHASE_TOKENS_ROUTE);

  const { domainFilter, tabSelect = '' } = parseQS(location.search) as {
    domainFilter: string | undefined;
    tabSelect: TabName | undefined;
  };
  const filteredDomainId = domainFilter
    ? parseInt(domainFilter, 10) || COLONY_TOTAL_BALANCE_DOMAIN_ID
    : COLONY_TOTAL_BALANCE_DOMAIN_ID;

  const defaultActiveTab =
    TabName[`${capitalize(tabSelect)}Tab`] || TabName.TasksTab;

  const [activeTab, setActiveTab] = useState<TabName>(defaultActiveTab);

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

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [data && data.colonyAddress],
    [data && data.colonyAddress],
  );

  const currentDomainUserRoles = useTransformer(getUserRoles, [
    domains,
    filteredDomainId || ROOT_DOMAIN,
    walletAddress,
  ]);

  const rootUserRoles = useTransformer(getUserRoles, [
    domains,
    ROOT_DOMAIN,
    walletAddress,
  ]);

  const crumbs = useMemo(() => {
    switch (filteredDomainId) {
      case 0:
        return [{ id: 'domain.all' }];

      case 1:
        return [{ id: 'domain.root' }];

      default:
        if (!domains) {
          return [{ id: 'domain.root' }];
        }
        return domains[filteredDomainId]
          ? [{ id: 'domain.root' }, domains[filteredDomainId].name]
          : [{ id: 'domain.root' }];
    }
  }, [domains, filteredDomainId]);

  if (!colonyName || (reverseENSAddress as any) instanceof Error) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (
    !domains ||
    isFetchingDomains ||
    !data ||
    !data.colonyAddress ||
    !data.colony
  ) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const { colony } = data;

  const canCreateTask = canAdminister(currentDomainUserRoles) && !!username;

  const nativeToken = colony.tokens.find(
    ({ address }) => address === colony.nativeTokenAddress,
  );

  const noFilter = (
    <Heading
      text={MSG.noFilter}
      appearance={{ size: 'tiny', margin: 'small' }}
    />
  );

  return (
    <div
      className={getMainClasses({}, styles, {
        withFundingSidebar: !isCoinMachine,
      })}
    >
      <div className={styles.grid}>
        <aside className={styles.colonyInfo}>
          <div className={styles.metaContainer}>
            <ColonyMeta
              colony={colony}
              canAdminister={
                !colony.isInRecoveryMode && canAdminister(rootUserRoles)
              }
              domains={domains}
              filteredDomainId={filteredDomainId}
            />
          </div>
        </aside>
        <main className={styles.content}>
          <Switch>
            <Route exact path={COLONY_PURCHASE_TOKENS_ROUTE}>
              {nativeToken && (
                <CoinMachine
                  colonyAddress={colony.colonyAddress}
                  colonyName={colony.colonyName}
                  colonyDisplayName={colony.displayName || colony.colonyName}
                  nativeToken={nativeToken}
                />
              )}
            </Route>
            <Route exact path={PROGRAM_ROUTE}>
              <Program
                colonyAddress={colony.colonyAddress}
                colonyName={colony.colonyName}
              />
            </Route>
            <Route exact path={LEVEL_ROUTE}>
              <LevelDashboard />
            </Route>
            <Route>
              <div className={styles.breadCrumbContainer}>
                {domains && crumbs && <BreadCrumb elements={crumbs} />}
              </div>
              <Tabs defaultIndex={Object.values(TabName).indexOf(activeTab)}>
                <TabList
                  extra={
                    activeTab === TabName.TransactionsTab ? noFilter : null
                  }
                >
                  <Tab onClick={() => setActiveTab(TabName.TasksTab)}>
                    <FormattedMessage {...MSG.tabContribute} />
                  </Tab>
                  <Tab onClick={() => setActiveTab(TabName.SuggestionsTab)}>
                    <FormattedMessage {...MSG.tabSuggestions} />
                  </Tab>
                  <Tab onClick={() => setActiveTab(TabName.CommunityTab)}>
                    <FormattedMessage {...MSG.tabCommunity} />
                  </Tab>
                  <Tab onClick={() => setActiveTab(TabName.TransactionsTab)}>
                    <FormattedMessage {...MSG.tabTransactions} />
                  </Tab>
                </TabList>
                <TabPanel>
                  <TabContribute
                    canCreateTask={canCreateTask}
                    colony={colony}
                    filteredDomainId={filteredDomainId}
                    showQrCode={hasRoot(rootUserRoles)}
                  />
                </TabPanel>
                <TabPanel>
                  <Suggestions
                    colonyAddress={colony.colonyAddress}
                    colonyName={colony.colonyName}
                    domainId={filteredDomainId}
                  />
                </TabPanel>
                <TabPanel>
                  <Community colonyAddress={colony.colonyAddress} />
                </TabPanel>
                <TabPanel>
                  <Transactions colonyAddress={colony.colonyAddress} />
                </TabPanel>
              </Tabs>
            </Route>
          </Switch>
        </main>
        {!isCoinMachine && (
          <aside className={styles.sidebar}>
            <ColonyFunding
              colony={colony}
              currentDomainId={filteredDomainId}
              domains={domains}
            />
          </aside>
        )}
        {colony.isInRecoveryMode && <RecoveryModeAlert />}
      </div>
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
