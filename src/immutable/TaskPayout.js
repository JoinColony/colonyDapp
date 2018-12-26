/* @flow */

import { Record } from 'immutable';

import Token from './Token';

import type { TokenRecord } from './Token';

export type TaskPayoutProps = {
  amount: number, // TODO: should be BigNumber
  token: TokenRecord,
};

const NETWORK_FEE = 0.01;

const defaultValues: $Shape<TaskPayoutProps> = {
  amount: undefined,
  token: Token(),
};

class TaskPayoutClass extends Record(defaultValues)<TaskPayoutProps> {
  // XXX This section repeats the flow types of `TaskPayoutProps` as properties
  // of the class, without interfering with the property accessors.
  // This is necessary because the `Record` flow type doesn't quite do
  // the trick when we extend it, and would otherwise complain about
  // missing properties.
  //
  /* eslint-disable */
  /*::
  token: TokenRecord;
  amount: number;
  */
  /* eslint-enable */

  get networkFee() {
    return this.amount * NETWORK_FEE;
  }
}

export type TaskPayoutRecord = TaskPayoutClass;

const TaskPayout = (props: TaskPayoutProps) => new TaskPayoutClass(props);

export default TaskPayout;
