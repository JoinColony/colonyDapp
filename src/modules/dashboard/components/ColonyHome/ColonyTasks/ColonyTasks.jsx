/* @flow */

// $FlowFixMe
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

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

import styles from './ColonyTasks.css';

type Props = {|
  canCreateTask: boolean,
  colonyAddress: Address,
  isInRecoveryMode: boolean,
  filterOption: string,
  filteredDomainId: number,
|};

const MSG = defineMessages({
  createTaskDescription: {
    id: 'dashboard.ColonyTasks.createTaskDescription',
    defaultMessage: 'One small task for Man, one giant leap for Mankind',
  },
});

const displayName = 'dashboard.ColonyTasks';

const ColonyTasks = ({
  canCreateTask,
  colonyAddress,
  filterOption,
  filteredDomainId,
  isInRecoveryMode,
}: Props) => {
  const walletAddress = useSelector(walletAddressSelector, []);

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

  // FIXME the icon isn't showing up
  if (draftIds.length === 0) {
    return canCreateTask ? (
      <div className={styles.createTaskContainer}>
        <ActionButton
          className={styles.createTaskButton}
          button={Icon}
          disabled={isInRecoveryMode}
          error={ACTIONS.TASK_CREATE_ERROR}
          name="circle-add"
          submit={ACTIONS.TASK_CREATE}
          success={ACTIONS.TASK_CREATE_SUCCESS}
          transform={transform}
        />
        <span className={styles.createTaskDescription}>
          <FormattedMessage {...MSG.createTaskDescription} />
        </span>
      </div>
    ) : null;
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
