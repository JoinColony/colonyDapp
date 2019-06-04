/* @flow */

import React from 'react';

import type { TaskProps, UserType } from '~immutable';

import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataFetcher, useSelector } from '~utils/hooks';

import { taskSelector } from '../../selectors';
import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { userFetcher } from '../../../users/fetchers';

type Props = TaskProps<{
  colonyAddress: *,
  draftId: *,
}>;

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({ colonyAddress, draftId }: Props) => {
  const {
    record: { payouts, reputation, workerAddress },
  } = useSelector(taskSelector, [draftId]);
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
