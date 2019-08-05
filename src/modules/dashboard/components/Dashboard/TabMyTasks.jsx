/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';

import type { Address } from '~types';
import type { TaskDraftId } from '~immutable';

import { SpinnerLoader, DotsLoader } from '~core/Preloaders';
import TaskList from '~dashboard/TaskList';

import type { InitialTaskType } from './InitialTask.jsx';
import type { TasksFilterOptionType } from '../shared/tasksFilter';

import InitialTask from './InitialTask.jsx';

import { currentUserDraftIdsFetcher } from '../../fetchers';

import styles from './TabMyTasks.css';

const MSG = defineMessages({
  loadingTaskList: {
    id: 'dashboard.Dashboard.TabMyTasks.loadingTaskList',
    defaultMessage: 'Loading Task List',
  },
});

type Props = {|
  filterOption: TasksFilterOptionType,
  initialTask: InitialTaskType,
  userClaimedProfile: boolean,
  walletAddress: Address,
|};

const TabMyTasks = ({
  filterOption,
  initialTask,
  userClaimedProfile,
  walletAddress,
}: Props) => {
  const { isFetching: isFetchingTasks, data: draftIds } = useDataFetcher<
    [Address, TaskDraftId][],
  >(currentUserDraftIdsFetcher, [], []);

  if (isFetchingTasks) {
    return <SpinnerLoader />;
  }

  if (!userClaimedProfile) {
    return (
      <>
        <InitialTask task={initialTask} />
        {draftIds && draftIds.length ? (
          <TaskList
            draftIds={draftIds}
            filterOption={filterOption}
            walletAddress={walletAddress}
          />
        ) : null}
      </>
    );
  }

  return draftIds ? (
    <TaskList
      draftIds={draftIds}
      filterOption={filterOption}
      walletAddress={walletAddress}
    />
  ) : (
    <>
      <div className={styles.loadingText}>
        <FormattedMessage {...MSG.loadingTaskList} />
        <DotsLoader />
      </div>
    </>
  );
};

export default TabMyTasks;
