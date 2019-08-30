import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';
import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import { SpinnerLoader } from '~core/Preloaders';
import TaskList from '~dashboard/TaskList';
import InitialTask, { InitialTaskType } from './InitialTask';
import { TasksFilterOptionType } from '../shared/tasksFilter';
import { currentUserDraftIdsFetcher } from '../../fetchers';

import styles from './UserTasks.css';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.UserTasks.emptyText',
    defaultMessage: "It looks like you don't have any tasks.",
  },
});

interface Props {
  filterOption: TasksFilterOptionType;
  initialTask: InitialTaskType;
  userClaimedProfile: boolean;
  walletAddress: Address;
  filter?: ReactNode;
}

const displayName: string = 'dashboard.Dashboard.UserTasks';

const UserTasks = ({
  filterOption,
  initialTask,
  userClaimedProfile,
  walletAddress,
  filter: FilterComponent,
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
        {FilterComponent}
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
    <>
      {FilterComponent}
      <TaskList
        draftIds={draftIds}
        filterOption={filterOption}
        walletAddress={walletAddress}
      />
    </>
  ) : (
    <p className={styles.emptyText}>
      <FormattedMessage {...MSG.emptyText} />
    </p>
  );
};

UserTasks.displayName = displayName;

export default UserTasks;
