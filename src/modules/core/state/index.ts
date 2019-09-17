import { Record, Map as ImmutableMap } from 'immutable';

import {
  Connection,
  ConnectionRecord,
  FetchableData,
  FetchableDataRecord,
  GasPrices,
  GasPricesRecord,
  Network,
  NetworkRecord,
} from '~immutable/index';
import { CoreTransactions, CoreTransactionsRecord } from './CoreTransactions';
import { CoreMessages, CoreMessagesRecord } from './Messages';

export * from './CoreTransactions';
export * from './Messages';

export type IpfsDataType = ImmutableMap<string, FetchableDataRecord<string>>;

export type CoreStateProps = {
  connection: ConnectionRecord;
  gasPrices: GasPricesRecord;
  ipfsData: IpfsDataType;
  messages: CoreMessagesRecord;
  network: FetchableDataRecord<NetworkRecord>;
  transactions: CoreTransactionsRecord;
};

// FIXME use constants for state everywhere
export class CoreStateRecord extends Record<CoreStateProps>({
  connection: Connection(),
  gasPrices: GasPrices(),
  ipfsData: ImmutableMap(),
  messages: CoreMessages(),
  network: FetchableData({
    record: Network(),
  }),
  transactions: CoreTransactions(),
}) {}
