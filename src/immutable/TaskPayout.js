/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { TaskPayoutProps } from '~types';

const defaultValues: TaskPayoutProps = {
  // TODO consider using just amount and token (TokenRecord) properties?
  symbol: '',
  amount: 0,
  isEth: undefined,
  isNative: undefined,
};

const TaskPayout: RecordFactory<TaskPayoutProps> = Record(defaultValues);

export default TaskPayout;
