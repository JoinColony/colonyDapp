/* @flow */

import React from 'react';

import type { TaskProps, UserType } from '~immutable';

import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataFetcher } from '~utils/hooks';

import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { userFetcher } from '../../../users/fetchers';

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
  const nativeTokenReference = useColonyNativeToken(colonyAddress);
  const { data: worker } = useDataFetcher<UserType>(
    userFetcher,
    [workerAddress],
    [workerAddress],
  );
  return nativeTokenReference ? (
    <Assignment
      nativeToken={nativeTokenReference}
      payouts={payouts}
      reputation={reputation}
      worker={worker}
    />
  ) : (
    <SpinnerLoader />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
