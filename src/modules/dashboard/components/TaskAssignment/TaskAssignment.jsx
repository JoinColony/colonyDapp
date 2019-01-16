/* @flow */
import React from 'react';

import type { TaskRecord } from '~immutable';

import Assignment from '~core/Assignment';

type Props = {
  nativeToken: string,
  task: TaskRecord,
};

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({
  nativeToken,
  task: { assignee, reputation, payouts },
}: Props) => (
  <Assignment
    assignee={assignee}
    reputation={reputation}
    payouts={payouts}
    nativeToken={nativeToken}
  />
);

TaskAssignment.displayName = displayName;

export default TaskAssignment;
