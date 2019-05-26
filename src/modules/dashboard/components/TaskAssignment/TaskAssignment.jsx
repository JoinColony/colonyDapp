/* @flow */

import React from 'react';

import type { TaskProps, UserType } from '~immutable';

import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataFetcher, useSelector } from '~utils/hooks';

import { isAssignmentPending } from '../../checks';
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
    record: {
      invites,
      payouts,
      reputation,
      workerAddress: assignedWorkerAddress,
    },
    record: taskRecord,
  } = useSelector(taskSelector, [draftId]);
  // Only 1 invite for MVP
  const isPending = isAssignmentPending(taskRecord);
  const workerAddress = isPending ? invites[0] : assignedWorkerAddress;
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
      pending={isPending}
      reputation={reputation}
      worker={worker}
    />
  ) : (
    <SpinnerLoader />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
