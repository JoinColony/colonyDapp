import React from 'react';

import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { AnyTask, FullColonyFragment, useTaskQuery } from '~data/index';

interface Props {
  draftId: AnyTask['id'];
  tokens: FullColonyFragment['tokens'];
}

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({ draftId, tokens }: Props) => {
  const { data } = useTaskQuery({ variables: { id: draftId } });

  // fixme get payouts from centralized store
  const payouts = [];

  if (!data) {
    return <SpinnerLoader />;
  }

  const {
    task: { assignedWorker },
  } = data;

  return tokens ? (
    <Assignment
      payouts={payouts}
      reputation={undefined}
      tokens={tokens}
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
