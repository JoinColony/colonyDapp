import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';
import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import { SpinnerLoader } from '~core/Preloaders';
import TaskList from '~dashboard/TaskList';
import InitialTask, { InitialTaskType } from './InitialTask';
import { TasksFilterOptionType } from '../shared/tasksFilter';
import { currentUserDraftIdsFetcher } from '../../fetchers';
import styles from './TabMyTasks.css';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyTasks.emptyText',
    // eslint-disable-next-line max-len
    defaultMessage: `It looks like you don't have any tasks. Visit your colonies to find a task to work on.`,
  },
});

interface Props {
  filterOption: TasksFilterOptionType;
  initialTask: InitialTaskType;
  userClaimedProfile: boolean;
  walletAddress: Address;
}

const TabMyTasks = ({
  filterOption,
  initialTask,
  userClaimedProfile,
  walletAddress,
}: Props) => {
  const { isFetching: isFetchingTasks, data: draftIds } = useDataFetcher<
    [Address, TaskDraftId][]
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
  return draftIds && draftIds.length ? (
    <TaskList
      draftIds={draftIds}
      filterOption={filterOption}
      walletAddress={walletAddress}
    />
  ) : (
    <>
      <p className={styles.emptyText}>
        <FormattedMessage {...MSG.emptyText} />
      </p>
    </>
  );
};
export default TabMyTasks;
