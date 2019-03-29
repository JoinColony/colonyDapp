/* @flow */

import React from 'react';

import type { TaskProps, UserType } from '~immutable';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { userFetcher } from '../../../users/fetchers';
import { colonyNativeTokenSelector } from '../../selectors';

import Assignment from '~core/Assignment';

type Props = TaskProps<{
  colonyENSName: *,
  draftId: *,
  payouts: *,
  reputation: *,
  worker: *,
}>;

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({
  colonyENSName,
  payouts,
  reputation,
  worker: workerAddress,
}: Props) => {
  const nativeToken = useSelector(colonyNativeTokenSelector, [colonyENSName]);
  const { data: worker } = useDataFetcher<UserType>(
    userFetcher,
    [workerAddress],
    [workerAddress],
  );
  const props = {
    nativeToken,
    payouts,
    reputation,
    ...(worker && { worker }),
  };
  return <Assignment {...props} />;
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
