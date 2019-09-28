import React, { useState, useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { useSelector } from '~utils/hooks';

import { Select } from '~core/Fields';
import Heading from '~core/Heading';
import { userDidClaimProfile } from '../../../users/checks';
import { currentUserSelector } from '../../../users/selectors';
import {
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';

import UserTasks from './UserTasks';
import ColoniesList from './ColoniesList';

import styles from './Dashboard.css';

const MSG = defineMessages({
  labelFilter: {
    id: 'dashboard.Dashboard.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.Dashboard.placeholderFilter',
    defaultMessage: 'Filter',
  },
  initialTaskTitle: {
    id: 'dashboard.Dashboard.initialTaskTitle',
    defaultMessage: 'Get started with Colony',
  },
  myTasks: {
    id: 'dashboard.Dashboard.myTasks',
    defaultMessage: 'My Tasks',
  },
  myColonies: {
    id: 'dashboard.Dashboard.myColonies',
    defaultMessage: `My Colonies`,
  },
});

const displayName = 'dashboard.Dashboard';

const Dashboard = () => {
  const [filterOption, setFilterOption] = useState(TasksFilterOptions.ALL_OPEN);

  const handleSetFilterOption = useCallback(
    (_: string, value: TasksFilterOptions) => {
      setFilterOption(value);
    },
    [setFilterOption],
  );

  const currentUser = useSelector(currentUserSelector);
  const {
    profile: { walletAddress = '' },
  } = currentUser;

  return (
    <div className={styles.layoutMain} data-test="dashboard">
      <main className={styles.content}>
        <div className={styles.sectionTitle}>
          <Heading
            appearance={{
              size: 'normal',
              margin: 'none',
              theme: 'dark',
            }}
            text={MSG.myTasks}
          />
        </div>
        <UserTasks
          initialTask={{
            title: MSG.initialTaskTitle,
            walletAddress,
          }}
          filter={
            <div className={styles.selectWrapper}>
              <Select
                appearance={{ alignOptions: 'right', theme: 'alt' }}
                connect={false}
                elementOnly
                label={MSG.labelFilter}
                name="filter"
                options={tasksFilterSelectOptions}
                placeholder={MSG.placeholderFilter}
                form={{ setFieldValue: handleSetFilterOption }}
                $value={filterOption}
              />
            </div>
          }
          userClaimedProfile={userDidClaimProfile(currentUser)}
          filterOption={filterOption}
          walletAddress={walletAddress}
        />
      </main>
      <aside className={styles.sidebar}>
        <div className={styles.sectionTitle}>
          <Heading
            appearance={{
              size: 'normal',
              margin: 'none',
              theme: 'dark',
            }}
            text={MSG.myColonies}
          />
        </div>
        <ColoniesList />
      </aside>
    </div>
  );
};

Dashboard.displayName = displayName;

export default Dashboard;
