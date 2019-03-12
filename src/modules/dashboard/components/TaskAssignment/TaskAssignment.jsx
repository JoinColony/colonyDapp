/* @flow */

import React from 'react';

import type { TaskType, UserType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';

import { userFetcher } from '../../../users/fetchers';

import Assignment from '~core/Assignment';

type Props = {|
  nativeToken: string,
  task: TaskType,
|};

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({
  nativeToken,
  task: { payouts, reputation, worker },
}: Props) => {
  const address = worker && worker.address;
  const { data: assignee } = useDataFetcher<UserType>(
    userFetcher,
    [address],
    [address],
  );
  const props = {
    ...(assignee && { assignee }),
    nativeToken,
    payouts,
    reputation,
  };
  return <Assignment {...props} />;
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
