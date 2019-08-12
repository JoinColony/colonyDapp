/* @flow */

import React from 'react';

import type { TaskProps, UserType } from '~immutable';

import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataSubscriber, useSelector } from '~utils/hooks';

import { taskSelector } from '../../selectors';
import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { useColonyTokens } from '../../hooks/useColonyTokens';
import { userSubscriber } from '../../../users/subscribers';

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
  const [, tokenOptions] = useColonyTokens(colonyAddress);
  const { data: worker } = useDataSubscriber<UserType>(
    userSubscriber,
    [workerAddress],
    [workerAddress],
  );
  return nativeTokenReference && tokenOptions ? (
    <Assignment
      nativeToken={nativeTokenReference}
      payouts={payouts}
      reputation={reputation}
      tokenOptions={tokenOptions}
      worker={worker}
      workerAddress={workerAddress}
    />
  ) : (
    <SpinnerLoader />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
