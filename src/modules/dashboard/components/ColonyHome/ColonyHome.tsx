import React, { useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';

import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Transactions from '~admin/Transactions';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import { Tab, TabList, TabPanel, Tabs } from '~core/Tabs';
import Suggestions from '~dashboard/Suggestions';
import Community from '~dashboard/Community';
import { useLoggedInUser } from '~data/helpers';
import { useColonyFromNameQuery } from '~data/index';
import LoadingTemplate from '~pages/LoadingTemplate';
import { useDataFetcher, useTransformer } from '~utils/hooks';

import { getUserRoles } from '../../../transformers';
import { canAdminister, hasRoot } from '../../../users/checks';
import { domainsAndRolesFetcher } from '../../fetchers';
import { NOT_FOUND_ROUTE } from '~routes/index';

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

enum TabName {
  SuggestionsTab = 'suggestions',
  TasksTab = 'tasks',
  CommunityTab = 'community',
  TransactionsTab = 'transactions',
}

interface Props {
  match: any;
}

const displayName = 'dashboard.ColonyHome';

const ColonyHome = ({
  match: {
    params: { colonyName },
  },
}: Props) => {
  const { walletAddress, username } = useLoggedInUser();

  const [filteredDomainId, setFilteredDomainId] = useState(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );
  const [activeTab, setActiveTab] = useState<TabName>(TabName.TasksTab);

  // @TODO: Try to get proper error handling going in resolvers (for colonies that don't exist)
  const { data, error: colonyFetchError } = useColonyFromNameQuery({
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
        return domains[filteredDomainId]
          ? [{ id: 'domain.root' }, domains[filteredDomainId].name]
          : [{ id: 'domain.root' }];
    }
  }, [domains, filteredDomainId]);

  if (!colonyName || colonyFetchError) {
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
                !colony.isInRecoveryMode && canAdminister(rootUserRoles)
              }
              domains={domains}
              filteredDomainId={filteredDomainId}
              setFilteredDomainId={setFilteredDomainId}
            />
          </div>
        </aside>
        <main className={styles.content}>
          <div className={styles.breadCrumbContainer}>
            {domains && crumbs && <BreadCrumb elements={crumbs} />}
          </div>
          <Tabs>
            <TabList
              extra={activeTab === TabName.TransactionsTab ? noFilter : null}
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
        </main>
        <aside className={styles.sidebar}>
          <ColonyFunding
            colony={colony}
            currentDomainId={filteredDomainId}
            domains={domains}
          />
        </aside>
        {colony.isInRecoveryMode && <RecoveryModeAlert />}
      </div>
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
