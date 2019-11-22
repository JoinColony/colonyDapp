import React from 'react';

import { TaskProps, UserType } from '~immutable/index';
import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataSubscriber, useSelector } from '~utils/hooks';
import { taskSelector } from '../../selectors';
import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { useColonyTokens } from '../../hooks/useColonyTokens';
import { userSubscriber } from '../../../users/subscribers';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props extends TaskProps<'colonyAddress' | 'draftId'> {}

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({ colonyAddress, draftId }: Props) => {
  const task = useSelector(taskSelector, [draftId]);
  const nativeTokenReference = useColonyNativeToken(colonyAddress);
  const [, tokenOptions] = useColonyTokens(colonyAddress);

  const workerAddress =
    task && task.record ? task.record.workerAddress : undefined;
  const { data: worker } = useDataSubscriber(
    userSubscriber,
    [workerAddress],
    [workerAddress],
  );

  return nativeTokenReference && tokenOptions ? (
    <Assignment
      nativeToken={nativeTokenReference}
      payouts={task && task.record ? task.record.payouts : undefined}
      reputation={task && task.record ? task.record.reputation : undefined}
      tokenOptions={tokenOptions}
      worker={worker as UserType}
      workerAddress={workerAddress}
    />
  ) : (
    <SpinnerLoader />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
