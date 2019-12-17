import React from 'react';

import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { useTaskQuery, useUser, AnyTask } from '~data/index';
import { Address } from '~types/index';

import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { useColonyTokens } from '../../hooks/useColonyTokens';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  draftId: AnyTask['id'];
  colonyAddress: Address;
}

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({ colonyAddress, draftId }: Props) => {
  const { data } = useTaskQuery({ variables: { id: draftId } });
  const nativeTokenReference = useColonyNativeToken(colonyAddress);
  const [, tokenOptions] = useColonyTokens(colonyAddress);

  // @todo get payouts from centralized store
  const payouts = [];

  if (!data) {
    return <SpinnerLoader />;
  }

  const {
    task: { assignedWorker },
  } = data;

  return nativeTokenReference && tokenOptions ? (
    <Assignment
      nativeToken={nativeTokenReference}
      payouts={payouts}
      reputation={undefined}
      tokenOptions={tokenOptions}
      worker={assignedWorker || undefined}
      workerAddress={assignedWorker ? assignedWorker.id : undefined}
    />
  ) : (
    <SpinnerLoader />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
