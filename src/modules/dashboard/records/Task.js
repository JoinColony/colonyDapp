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
  colonyIdentifier: '',
  creator: '',
  assignee: undefined,
  feedItems: new List(),
  currentState: TASK_STATE.ACTIVE,
  workerHasRated: false,
  workerRateFail: false,
  evaluatorHasRated: false,
  evaluatorRateFail: false,
  workerPayoutClaimed: false,
  managerPayoutClaimed: false,
  evaluatorPayoutClaimed: false,
};

// TODO: validate required props, rather than above defaults
const Task: RecordFactory<TaskProps> = Record(defaultValues);

export default Task;
