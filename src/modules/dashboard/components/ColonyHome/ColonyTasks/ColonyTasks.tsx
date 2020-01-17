import React from 'react';

import { Address } from '~types/index';
import { useColonyTasksQuery } from '~data/index';

import TaskList from '../../TaskList';
import NewTaskButton from './NewTaskButton';

import styles from './ColonyTasks.css';

interface Props {
  canCreateTask: boolean;
  colonyAddress: Address;
  isInRecoveryMode: boolean;
  filterOption: string;
  filteredDomainId: number;
  showEmptyState?: boolean;
  canMintTokens?: boolean;
  onCreateTask: () => void;
  isCreatingTask: boolean;
}

const displayName = 'dashboard.ColonyTasks';

const ColonyTasks = ({
  canCreateTask,
  canMintTokens,
  colonyAddress,
  filterOption,
  filteredDomainId,
  isInRecoveryMode,
  isCreatingTask,
  onCreateTask,
  showEmptyState = true,
}: Props) => {
  const { data } = useColonyTasksQuery({
    pollInterval: 5000,
    variables: { address: colonyAddress },
  });

  if (!data) {
    return null;
  }

  const {
    colony: { tasks },
  } = data;
  /*
   * If we can create tasks, but tokens are not yet minted, don't show the
   * create task action button
   */
  if (
    data.colony.tasks.length === 0 &&
    ((canCreateTask && showEmptyState) || (canCreateTask && !canMintTokens))
  ) {
    return (
      <NewTaskButton
        disabled={isInRecoveryMode}
        loading={isCreatingTask}
        onClick={onCreateTask}
      />
    );
  }

  /*
   * Let TaskList handle the empty states
   */
  return (
    <div className={styles.taskList}>
      <TaskList
        colonyAddress={colonyAddress}
        tasks={tasks}
        filteredDomainId={filteredDomainId}
        filterOption={filterOption}
        /*
         * - If we can create tasks, but no tokens are minted,
         *   don't show the empty state.
         * - If we can't create tasks, and no tokens are minted,
         *   show the empty state.
         */
        showEmptyState={!canCreateTask}
      />
    </div>
  );
};

ColonyTasks.displayName = displayName;

export default ColonyTasks;
