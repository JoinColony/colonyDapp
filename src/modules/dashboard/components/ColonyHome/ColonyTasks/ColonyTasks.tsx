import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { subscribeActions as subscribeToReduxActions } from 'redux-action-watch/lib/actionCreators';
import { useDispatch } from 'redux-react-hook';
import throttle from 'lodash/throttle';

import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { ActionButton } from '~core/Button';
import Icon from '~core/Icon';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataSubscriber, useSelector } from '~utils/hooks';

import { ROOT_DOMAIN } from '../../../../core/constants';
import { colonyTaskMetadataSubscriber } from '../../../subscribers';
import { walletAddressSelector } from '../../../../users/selectors';
import { TaskMetadataMap } from '../../../state/index';
import TaskList from '../../TaskList';
import styles from './ColonyTasks.css';

interface Props {
  canCreateTask: boolean;
  colonyAddress: Address;
  isInRecoveryMode: boolean;
  filterOption: string;
  filteredDomainId: number;
  showEmptyState?: boolean;
  canMintTokens?: boolean;
}

const MSG = defineMessages({
  newTask: {
    id: 'dashboard.ColonyTasks.newTask',
    defaultMessage: 'Create a new task',
  },
  newTaskDescription: {
    id: 'dashboard.ColonyTasks.newTaskDescription',
    defaultMessage: 'Create a new task',
  },
  noTasks: {
    id: 'dashboard.ColonyTasks.noTasks',
    defaultMessage: `It looks like you don't have any tasks.
      Visit your colonies to find a task to work on.`,
  },
  welcomeToColony: {
    id: 'dashboard.ColonyTasks.welcomeToColony',
    defaultMessage: `Welcome to {colonyNameExists, select,
      true {{colonyName}}
      other {the Colony}
    }!`,
  },
  creatingTask: {
    id: 'dashboard.ColonyTasks.creatingTask',
    defaultMessage: 'Creating your task...',
  },
  noCurrentlyOpenTasks: {
    id: 'dashboard.TaskList.noCurrentlyOpenTasks',
    defaultMessage: 'It looks like there are no open tasks right now.',
  },
});

const displayName = 'dashboard.ColonyTasks';

const NewTaskButton = ({
  onClick,
  disabled,
  loading,
}: {
  onClick: Function;
  disabled: boolean;
  loading: boolean;
}) => {
  const [iconName, setIconName] = useState('empty-task');
  if (disabled) {
    return null;
  }
  if (loading) {
    return (
      <div className={styles.newTaskSpinnerContainer}>
        <SpinnerLoader
          appearance={{ theme: 'primary', size: 'massive' }}
          loadingText={MSG.creatingTask}
        />
      </div>
    );
  }
  return (
    /*
     * Ordinarily this wouldn't be necessary, but we can't use <button>
     * because of the style requirements.
     */
    <div className={styles.newTaskButtonContainer}>
      <Icon
        className={styles.newTaskButton}
        name={iconName}
        onMouseEnter={() => setIconName('active-task')}
        onMouseLeave={() => setIconName('empty-task')}
        onClick={throttle(onClick as any, 2000)}
        title={MSG.newTask}
        viewBox="0 0 132 132"
      />
      <FormattedMessage tagName="p" {...MSG.newTaskDescription} />
    </div>
  );
};

const ColonyTasks = ({
  canCreateTask,
  colonyAddress,
  filterOption,
  filteredDomainId,
  isInRecoveryMode,
  showEmptyState = true,
  canMintTokens,
}: Props) => {
  const [isTaskBeingCreated, setIsTaskBeingCreated] = useState(false);

  const walletAddress = useSelector(walletAddressSelector, []);

  const dispatch = useDispatch();

  /*
   * This needs to return the `subscribeToReduxActions` function, since that returns an
   * unsubscriber, and that gets called when the component is unmounted
   */
  useEffect(
    () =>
      subscribeToReduxActions(dispatch)({
        [ActionTypes.TASK_CREATE]: () => setIsTaskBeingCreated(true),
        [ActionTypes.TASK_CREATE_SUCCESS]: () => setIsTaskBeingCreated(false),
        [ActionTypes.TASK_CREATE_ERROR]: () => setIsTaskBeingCreated(false),
      }),
    [dispatch],
  );

  const { data: taskMetadata, isFetching } = useDataSubscriber<TaskMetadataMap>(
    colonyTaskMetadataSubscriber,
    [colonyAddress],
    [colonyAddress],
  );

  // This could be simpler if we had the tuples ready to select from state
  const draftIds = useMemo(
    () =>
      Object.keys(taskMetadata || {}).map(draftId => [colonyAddress, draftId]),
    [colonyAddress, taskMetadata],
  ) as [Address, TaskDraftId][];

  const transform = useCallback(
    mergePayload({ colonyAddress, domainId: filteredDomainId || ROOT_DOMAIN }),
    [filteredDomainId, colonyAddress],
  );

  if (isFetching) {
    return null;
  }

  /*
   * If we can create tasks, but tokens are not yet minted, don't show the
   * create task action button
   */
  if (
    draftIds.length === 0 &&
    ((canCreateTask && showEmptyState) || (canCreateTask && !canMintTokens))
  ) {
    return (
      <ActionButton
        button={NewTaskButton}
        disabled={isInRecoveryMode}
        error={ActionTypes.TASK_CREATE_ERROR}
        submit={ActionTypes.TASK_CREATE}
        success={ActionTypes.TASK_CREATE_SUCCESS}
        transform={transform}
        loading={isTaskBeingCreated}
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
        draftIds={draftIds}
        filteredDomainId={filteredDomainId}
        filterOption={filterOption}
        walletAddress={walletAddress}
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
