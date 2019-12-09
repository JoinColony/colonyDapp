import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';
import TaskList from '~dashboard/TaskList';
import { useUserTaskIdsQuery } from '~data/index';

import InitialTask, { InitialTaskType } from './InitialTask';
import { TasksFilterOptionType } from '../shared/tasksFilter';

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
  filter?: ReactNode;
  walletAddress: Address;
}

const displayName = 'dashboard.Dashboard.UserTasks';

const UserTasks = ({
  filterOption,
  initialTask,
  userClaimedProfile,
  filter: FilterComponent,
  walletAddress,
}: Props) => {
  // @TODO: pass the whole task into the TaskList as opposed to just the id

  const { data } = useUserTaskIdsQuery({
    variables: { address: walletAddress },
  });

  if (!data) {
    return <SpinnerLoader />;
  }

  const {
    user: { tasks },
  } = data;
  const draftIds = tasks.map(({ id }) => id);

  if (!userClaimedProfile) {
    return (
      <>
        {FilterComponent}
        <InitialTask task={initialTask} />
        {draftIds && draftIds.length ? (
          <TaskList draftIds={draftIds} filterOption={filterOption} />
        ) : null}
      </>
    );
  }
  return draftIds && draftIds.length ? (
    <>
      {!!FilterComponent && (
        <div className={styles.filter}>{FilterComponent}</div>
      )}
      <div className={styles.taskList}>
        <TaskList draftIds={draftIds} filterOption={filterOption} />
      </div>
    </>
  ) : (
    <p className={styles.emptyText}>
      <FormattedMessage {...MSG.emptyText} />
    </p>
  );
};

UserTasks.displayName = displayName;

export default UserTasks;
