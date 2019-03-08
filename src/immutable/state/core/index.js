/* @flow */

import type { RecordOf, Collection as CollectionType } from 'immutable';

import type { CoreTransactionsRecord } from './CoreTransactions';

export { default as GasPrices } from './GasPrices';
export { default as CoreTransactions } from './CoreTransactions';
export { default as Network } from './Network';

export * from './GasPrices';
export * from './CoreTransactions';
export * from './Network';

export type CoreStateProps = {|
  transactions: CoreTransactionsRecord,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type CoreStateRecord = CollectionType<*, *> & RecordOf<CoreStateProps>;
