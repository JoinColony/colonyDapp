/* @flow */

import type { RecordOf } from 'immutable';

export type TaskPayoutProps = {
  symbol: string,
  amount: number, // TODO: should be BigNumber
  // TODO we probably don't need these props, but they are used elsewhere
  isEth?: boolean,
  isNative?: boolean,
};

export type TaskPayoutRecord = RecordOf<TaskPayoutProps>;
