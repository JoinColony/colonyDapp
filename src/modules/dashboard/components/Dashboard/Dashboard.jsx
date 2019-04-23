/* @flow */

// $FlowFixMe
import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';

import { userFetcher } from '../../../users/fetchers';
import { walletAddressSelector } from '../../../users/selectors';
import { userDidClaimProfile } from '../../../users/checks';

import type { TasksFilterOptionType } from '../shared/tasksFilter';

import {
  TASKS_FILTER_OPTIONS,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';

import styles from './Dashboard.css';

import TabMyTasks from './TabMyTasks.jsx';
import TabMyColonies from './TabMyColonies.jsx';

const MSG = defineMessages({
  tabMyTasks: {
    id: 'dashboard.Dashboard.tabMyTasks',
    defaultMessage: 'My Tasks',
  },
  tabMyColonies: {
    id: 'dashboard.Dashboard.tabMyColonies',
    defaultMessage: 'My Colonies',
  },
  labelFilter: {
    id: 'dashboard.Dashboard.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.Dashboard.placeholderFilter',
    defaultMessage: 'Filter',
  },
  helpText: {
    id: 'dashboard.Dashboard.helpText',
    defaultMessage: 'Need help using Colony? Visit our Help Center',
  },
  linkHelpCenter: {
    id: 'dashboard.Dashboard.linkHelpCenter',
    defaultMessage: 'Help Center',
  },
  initialTaskTitle: {
    id: 'dashboard.Dashboard.initialTaskTitle',
    defaultMessage: 'Get started with Colony',
  },
});

const displayName = 'dashboard.Dashboard';

const Dashboard = () => {
  const walletAddress = useSelector(walletAddressSelector);
  const { data: currentUser } = useDataFetcher(
    userFetcher,
    [walletAddress],
    [walletAddress],
  );

  const [filterOption, setFilterOption] = useState(TASKS_FILTER_OPTIONS.ALL);
  const [tabIndex, setTabIndex] = useState(0);

  const setFieldValue = useCallback(
    (_: string, value: TasksFilterOptionType) => {
      setFilterOption(value);
    },
    [setFilterOption],
  );

  return (
    <div className={styles.layoutMain}>
      <main className={styles.content}>
        <Tabs onSelect={setTabIndex}>
          <TabList
            extra={
              tabIndex === 0 && (
                <Select
                  appearance={{ alignOptions: 'right', theme: 'alt' }}
                  connect={false}
                  elementOnly
                  label={MSG.labelFilter}
                  name="filter"
                  options={tasksFilterSelectOptions}
                  placeholder={MSG.placeholderFilter}
                  form={{ setFieldValue }}
                  $value={filterOption}
                />
              )
            }
          >
            <Tab>
              <FormattedMessage {...MSG.tabMyTasks} />
            </Tab>
            <Tab>
              <FormattedMessage {...MSG.tabMyColonies} />
            </Tab>
          </TabList>
          <TabPanel>
            <TabMyTasks
              initialTask={{
                title: MSG.initialTaskTitle,
                walletAddress,
              }}
              userClaimedProfile={userDidClaimProfile(currentUser)}
              filterOption={filterOption}
              walletAddress={walletAddress}
            />
          </TabPanel>
          <TabPanel>
            <TabMyColonies />
          </TabPanel>
        </Tabs>
      </main>
      <aside className={styles.sidebar}>
        <p className={styles.helpText}>
          <FormattedMessage {...MSG.helpText} />
          <br />
          <br />
          <ExternalLink text={MSG.linkHelpCenter} href="#" />
        </p>
      </aside>
    </div>
  );
};

Dashboard.displayName = displayName;

export default Dashboard;
