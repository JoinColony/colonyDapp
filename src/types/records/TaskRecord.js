/* @flow */

import type { RecordOf, List } from 'immutable';
import type { UserRecord } from './UserRecord';
import type { AddressOrENSName } from '../../lib/ColonyManager/types';

import { TASK_STATE } from '../../modules/dashboard/records/index';

import type { TaskFeedItemRecord, TaskPayoutRecord } from '~types';

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

export type TaskProps = {
  id: number,
  title: string,
  dueDate?: Date,
  reputation: number, // TODO: should be BigNumber
  payouts: List<TaskPayoutRecord>,
  colonyIdentifier: AddressOrENSName,
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
