import React, { useState, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import { useDataFetcher, useTransformer } from '~utils/hooks';
import Transactions from '~admin/Transactions';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import Heading from '~core/Heading';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';
import BreadCrumb from '~core/BreadCrumb';
import { domainsAndRolesFetcher } from '../../fetchers';
import { getUserRoles } from '../../../transformers';
import { useLoggedInUser } from '~data/helpers';
import { canAdminister, hasRoot } from '../../../users/checks';

import { useColonyFromNameQuery } from '~data/index';
import ColonyFunding from './ColonyFunding';
import ColonyMeta from './ColonyMeta';
import TabContribute from './TabContribute';

import styles from './ColonyHome.css';

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
  noFilter: {
    id: 'dashboard.ColonyHome.noFilter',
    defaultMessage: 'All Transactions in Colony',
  },
});

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
  const [activeTab, setActiveTab] = useState<'tasks' | 'transactions'>('tasks');

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

  const canCreateTask = canAdminister(currentDomainUserRoles) && !!username;

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
          <TabList extra={activeTab === 'tasks' ? null : noFilter}>
            <Tab onClick={() => setActiveTab('tasks')}>
              <FormattedMessage {...MSG.tabContribute} />
            </Tab>
            <Tab onClick={() => setActiveTab('transactions')}>
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
            <Transactions colonyAddress={colony.colonyAddress} />
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
