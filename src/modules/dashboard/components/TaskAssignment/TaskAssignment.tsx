import React from 'react';

import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { AnyTask, FullColonyFragment, useTaskQuery } from '~data/index';
import { Address } from '~types/index';

interface Props {
  draftId: AnyTask['id'];
  nativeTokenAddress: Address;
  tokens: FullColonyFragment['tokens'];
}

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({ draftId, nativeTokenAddress, tokens }: Props) => {
  const { data } = useTaskQuery({ variables: { id: draftId } });

  if (!data) {
    return <SpinnerLoader />;
  }

  const {
    task: { assignedWorker, payouts },
  } = data;

  return tokens ? (
    <Assignment
      payouts={payouts}
      reputation={undefined}
      nativeTokenAddress={nativeTokenAddress}
      worker={assignedWorker || undefined}
      workerAddress={
        assignedWorker ? assignedWorker.profile.walletAddress : undefined
      }
    />
  ) : (
    <SpinnerLoader />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
