/* @flow */

import type {
  RecordOf,
  Collection as CollectionType,
  Map as ImmutableMapType,
} from 'immutable';

import type { CoreTransactionsRecord } from './CoreTransactions';
import type { GasPricesRecord } from './GasPrices';
import type { NetworkRecord } from './Network';
import type { DataRecordType } from '../../Data';
import type { CoreMessagesRecord } from './Messages';
import type { ConnectionStatsRecord } from './ConnectionStats';

export { default as GasPrices } from './GasPrices';
export { default as CoreTransactions } from './CoreTransactions';
export { default as Network } from './Network';
export { default as CoreMessages } from './Messages';
export { default as ConnectionStats } from './ConnectionStats';

export * from './GasPrices';
export * from './CoreTransactions';
export * from './Network';
export * from './Messages';
export * from './ConnectionStats';

export type IpfsDataType = ImmutableMapType<string, DataRecordType<string>>;

export type CoreStateProps = {|
  gasPrices: GasPricesRecord,
  transactions: CoreTransactionsRecord,
  network: NetworkRecord,
  ipfsData: IpfsDataType,
  messages: CoreMessagesRecord,
  connectionStats: ConnectionStatsRecord,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type CoreStateRecord = CollectionType<*, *> & RecordOf<CoreStateProps>;

export type NetworkType = DataRecordType<NetworkRecord>;
