/* @flow */

import type { RecordOf, List } from 'immutable';
import type { UserRecord } from './UserRecord';

import { TASK_STATE } from '~immutable';

import type { ENSName, TaskFeedItemRecord, TaskPayoutRecord } from '~types';

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

export type TaskProps = {
  id: number,
  title: string,
  dueDate?: Date,
  reputation: number, // TODO: should be BigNumber
  payouts: List<TaskPayoutRecord>,
  colonyENSName: ENSName,
  creator: string,
  assignee?: UserRecord,
  feedItems: List<TaskFeedItemRecord>,
  currentState: TaskCurrentState,
  workerHasRated: boolean,
  managerHasRated: boolean,
  workerPayoutClaimed: boolean,
  managerPayoutClaimed: boolean,
};

export type TaskRecord = RecordOf<TaskProps>;
