/* @flow */

import type { RecordFactory } from 'immutable';

import { Record, List } from 'immutable';

import type { TaskProps } from '~types';

import { TASK_STATE } from './constants';

const defaultValues: TaskProps = {
  id: 0,
  title: '',
  dueDate: undefined,
  reputation: 0,
  payouts: new List(),
  colonyENSName: '',
  creator: '',
  assignee: undefined,
  feedItems: new List(),
  currentState: TASK_STATE.ACTIVE,
  workerHasRated: false,
  managerHasRated: false,
  workerPayoutClaimed: false,
  managerPayoutClaimed: false,
};

// TODO: validate required props, rather than above defaults
const Task: RecordFactory<TaskProps> = Record(defaultValues);

export default Task;
