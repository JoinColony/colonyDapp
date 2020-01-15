import React, { useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router';

import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Transactions from '~admin/Transactions';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import { Tab, TabList, TabPanel, Tabs } from '~core/Tabs';
import Suggestions from '~dashboard/Suggestions';
import { useLoggedInUser } from '~data/helpers';
import { useColonyFromNameQuery } from '~data/index';
import LoadingTemplate from '~pages/LoadingTemplate';
import { useDataFetcher, useTransformer } from '~utils/hooks';

import { getUserRoles } from '../../../transformers';
import { canAdminister, hasRoot } from '../../../users/checks';
import { domainsAndRolesFetcher } from '../../fetchers';

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
  noFilter: {
    id: 'dashboard.ColonyHome.noFilter',
    defaultMessage: 'All Transactions in Colony',
  },
});

type TabName = 'suggestions' | 'tasks' | 'transactions';

interface Props {
  match: any;
}

const displayName = 'dashboard.ColonyHome';

const ColonyHome = ({
  match: {
    params: { colonyName },
  },
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const [filteredDomainId, setFilteredDomainId] = useState(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );
  const [activeTab, setActiveTab] = useState<TabName>('tasks');

  // @TODO: Try to get proper error handling going in resolvers (for colonies that don't exist)
  const { data } = useColonyFromNameQuery({
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

  if (!colonyName) {
    return <Redirect to="/404" />;
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

  // Eventually this has to be in the proper domain. There's probably going to be a different UI for that
  const canCreateTask = canAdminister(currentDomainUserRoles);

  const noFilter = (
    <Heading
      text={MSG.noFilter}
      appearance={{ size: 'tiny', margin: 'small' }}
    />
  );

  return (
    <div className={styles.main}>
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
          <TabList extra={activeTab === 'transactions' ? noFilter : null}>
            <Tab onClick={() => setActiveTab('tasks')}>
              <FormattedMessage {...MSG.tabContribute} />
            </Tab>
            <Tab onClick={() => setActiveTab('transactions')}>
              <FormattedMessage {...MSG.tabTransactions} />
            </Tab>
            <Tab onClick={() => setActiveTab('suggestions')}>
              <FormattedMessage {...MSG.tabSuggestions} />
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
            <Transactions colonyAddress={colony.colonyAddress} />
          </TabPanel>
          <TabPanel>
            <Suggestions colonyAddress={colony.colonyAddress} />
          </TabPanel>
        </Tabs>
      </main>
      <aside className={styles.sidebar}>
        <ColonyFunding colony={colony} currentDomainId={filteredDomainId} />
      </aside>
      {colony.isInRecoveryMode && <RecoveryModeAlert />}
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
