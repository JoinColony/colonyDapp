/* @flow */

import React from 'react';

import type { TaskProps, UserType } from '~immutable';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { userFetcher } from '../../../users/fetchers';
import { colonyNativeTokenSelector } from '../../selectors';

import Assignment from '~core/Assignment';

type Props = TaskProps<{
  colonyAddress: *,
  draftId: *,
  payouts: *,
  reputation: *,
  workerAddress: *,
}>;

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({
  colonyAddress,
  payouts,
  reputation,
  workerAddress,
}: Props) => {
  const nativeToken = useSelector(colonyNativeTokenSelector, [colonyAddress]);
  const { data: worker } = useDataFetcher<UserType>(
    userFetcher,
    [workerAddress],
    [workerAddress],
  );
  return (
    <Assignment
      nativeToken={nativeToken}
      payouts={payouts}
      reputation={reputation}
      worker={worker}
    />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
