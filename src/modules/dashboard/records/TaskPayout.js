/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { TaskPayoutProps } from '~types';

const defaultValues: TaskPayoutProps = {
  symbol: '',
  amount: 0,
  // TODO we probably don't need these props, but they are used elsewhere
  isEth: undefined,
  isNative: undefined,
};

const TaskPayout: RecordFactory<TaskPayoutProps> = Record(defaultValues);

export default TaskPayout;
