/* @flow */

// $FlowFixMe
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { subscribeActions as subscribeToReduxActions } from 'redux-action-watch/lib/actionCreators';
import { useDispatch } from 'redux-react-hook';
import throttle from 'lodash/throttle';

import type { Address } from '~types';
import type { TaskMetadataMap } from '~immutable';

import { ACTIONS } from '~redux';
import { mergePayload } from '~utils/actions';
import { useDataFetcher, useSelector } from '~utils/hooks';
import { colonyTaskMetadataFetcher } from '../../../fetchers';
import { walletAddressSelector } from '../../../../users/selectors';

import TaskList from '../../TaskList';

import { ActionButton } from '~core/Button';
import Icon from '~core/Icon';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './ColonyTasks.css';

type Props = {|
  canCreateTask: boolean,
  colonyAddress: Address,
  isInRecoveryMode: boolean,
  filterOption: string,
  filteredDomainId: number,
|};

const MSG = defineMessages({
  newTask: {
    id: 'dashboard.ColonyTasks.newTask',
    defaultMessage: 'New task',
  },
  newTaskDescription: {
    id: 'dashboard.ColonyTasks.newTaskDescription',
    defaultMessage: 'One small task for Man, one giant leap for Mankind',
  },
  noTasksAvailable: {
    id: 'dashboard.ColonyTasks.noTasksAvailable',
    defaultMessage:
      // eslint-disable-next-line max-len
      'There are no tasks created yet. While you wait, we suggest subscribing to this Colony',
  },
  creatingTask: {
    id: 'dashboard.ColonyTasks.creatingTask',
    defaultMessage: 'Creating your task...',
  },
});

const displayName = 'dashboard.ColonyTasks';

const NewTaskButton = ({
  onClick,
  disabled,
  loading,
}: {
  onClick: Function,
  disabled: boolean,
  loading: boolean,
}) => {
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      onClick={throttle(onClick, 2000)}
      className={styles.newTaskButtonContainer}
    >
      <Icon
        className={styles.newTaskButton}
        name="circle-add"
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
}: Props) => {
  const walletAddress = useSelector(walletAddressSelector, []);

  const dispatch = useDispatch();
  const [isTaskBeingCreated, setIsTaskBeingCreated] = useState(false);

  /*
   * @NOTE this needs to return the `subscribeToReduxActions` function, since that returns an
   * unsubscriber, and that gets called when the component is unmounted
   */
  useEffect(
    () =>
      subscribeToReduxActions(dispatch)({
        [ACTIONS.TASK_CREATE]: () => setIsTaskBeingCreated(true),
        [ACTIONS.TASK_CREATE_SUCCESS]: () => setIsTaskBeingCreated(false),
        [ACTIONS.TASK_CREATE_ERROR]: () => setIsTaskBeingCreated(false),
      }),
    [dispatch, setIsTaskBeingCreated],
  );

  const { data: taskMetadata, isFetching } = useDataFetcher<TaskMetadataMap>(
    colonyTaskMetadataFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  // This could be simpler if we had the tuples ready to select from state
  const draftIds = useMemo(
    () =>
      Object.keys(taskMetadata || {}).map(draftId => [colonyAddress, draftId]),
    [taskMetadata, colonyAddress],
  );

  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);

  if (isFetching) {
    return null;
  }

  if (draftIds.length === 0) {
    return canCreateTask ? (
      <ActionButton
        button={NewTaskButton}
        disabled={isInRecoveryMode}
        error={ACTIONS.TASK_CREATE_ERROR}
        submit={ACTIONS.TASK_CREATE}
        success={ACTIONS.TASK_CREATE_SUCCESS}
        transform={transform}
        loading={isTaskBeingCreated}
      />
    ) : (
      <FormattedMessage tagName="p" {...MSG.noTasksAvailable} />
    );
  }

  return (
    <TaskList
      draftIds={draftIds}
      filteredDomainId={filteredDomainId}
      filterOption={filterOption}
      walletAddress={walletAddress}
    />
  );
};

ColonyTasks.displayName = displayName;

export default ColonyTasks;
