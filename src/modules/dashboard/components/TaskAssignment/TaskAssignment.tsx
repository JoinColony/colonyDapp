import React from 'react';

import { TaskProps } from '~immutable/index';
import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { useSelector } from '~utils/hooks';
import { useUser } from '~data/helpers';
import { taskSelector } from '../../selectors';
import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { useColonyTokens } from '../../hooks/useColonyTokens';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props extends TaskProps<'colonyAddress' | 'draftId'> {}

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({ colonyAddress, draftId }: Props) => {
  const task = useSelector(taskSelector, [draftId]);
  const nativeTokenReference = useColonyNativeToken(colonyAddress);
  const [, tokenOptions] = useColonyTokens(colonyAddress);

  // FIXME we should expand the user from the task
  const worker = useUser(task.record.workerAddress);

  return nativeTokenReference && tokenOptions ? (
    <Assignment
      nativeToken={nativeTokenReference}
      payouts={task && task.record ? task.record.payouts : undefined}
      reputation={task && task.record ? task.record.reputation : undefined}
      tokenOptions={tokenOptions}
      worker={worker}
      workerAddress={task.record.workerAddress}
    />
  ) : (
    <SpinnerLoader />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
