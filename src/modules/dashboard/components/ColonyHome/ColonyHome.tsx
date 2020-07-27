import React, { useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect, Route, RouteChildrenProps, Switch } from 'react-router-dom';
import { parse as parseQS } from 'query-string';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Transactions from '~admin/Transactions';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import { Tab, TabList, TabPanel, Tabs } from '~core/Tabs';
import Community from '~dashboard/Community';
import LevelDashboard from '~dashboard/LevelDashboard';
import Program from '~dashboard/Program';
import Suggestions from '~dashboard/Suggestions';
import { useLoggedInUser } from '~data/helpers';
import { useColonyFromNameQuery } from '~data/index';
import LoadingTemplate from '~pages/LoadingTemplate';
import { NOT_FOUND_ROUTE, LEVEL_ROUTE, PROGRAM_ROUTE } from '~routes/index';
import { capitalize } from '~utils/strings';
import { useTransformer } from '~utils/hooks';

import { getUserRolesForDomain } from '../../../transformers';
import { canAdminister, canArchitect, hasRoot } from '../../../users/checks';

import ColonyFunding from './ColonyFunding';
import styles from './ColonyHome.css';
import ColonyMeta from './ColonyMeta';
import TabContribute from './TabContribute';

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

  const colonyDomains = data && data.colony && data.colony.domains;

  const filteredDomain = colonyDomains
    ? colonyDomains.find(({ ethDomainId }) => ethDomainId === filteredDomainId)
    : undefined;

  const currentDomainUserRoles = useTransformer(getUserRolesForDomain, [
    data && data.colony,
    walletAddress,
    filteredDomainId || ROOT_DOMAIN_ID,
  ]);

  const rootUserRoles = useTransformer(getUserRolesForDomain, [
    data && data.colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  const crumbs = useMemo(() => {
    switch (filteredDomainId) {
      case 0:
        return [{ id: 'domain.all' }];

      case 1:
        return [{ id: 'domain.root' }];

      default:
        if (!colonyDomains || !colonyDomains.length) {
          return [{ id: 'domain.root' }];
        }
        return filteredDomain
          ? [{ id: 'domain.root' }, filteredDomain.name]
          : [{ id: 'domain.root' }];
    }
  }, [colonyDomains, filteredDomain, filteredDomainId]);

  if (!colonyName || (reverseENSAddress as any) instanceof Error) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!data || !data.colonyAddress || !data.colony) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const { colony } = data;

  const canCreateTask = canAdminister(currentDomainUserRoles) && !!username;

  const noFilter = (
    <Heading
      text={MSG.noFilter}
      appearance={{ size: 'tiny', margin: 'small' }}
    />
  );

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <aside className={styles.colonyInfo}>
          <div className={styles.metaContainer}>
            <ColonyMeta
              colony={colony}
              canAdminister={
                !colony.isInRecoveryMode &&
                (canAdminister(rootUserRoles) || canArchitect(rootUserRoles))
              }
              filteredDomainId={filteredDomainId}
            />
          </div>
        </aside>
        <main className={styles.content}>
          <Switch>
            <Route exact path={PROGRAM_ROUTE}>
              <Program colony={colony} />
            </Route>
            <Route exact path={LEVEL_ROUTE}>
              <LevelDashboard colony={colony} />
            </Route>
            <Route>
              <div className={styles.breadCrumbContainer}>
                {crumbs && <BreadCrumb elements={crumbs} />}
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
                  <Suggestions colony={colony} domainId={filteredDomainId} />
                </TabPanel>
                <TabPanel>
                  <Community colony={colony} />
                </TabPanel>
                <TabPanel>
                  <Transactions colonyAddress={colony.colonyAddress} />
                </TabPanel>
              </Tabs>
            </Route>
          </Switch>
        </main>
        <aside className={styles.sidebar}>
          <ColonyFunding colony={colony} currentDomainId={filteredDomainId} />
        </aside>
        {colony.isInRecoveryMode && <RecoveryModeAlert />}
      </div>
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
