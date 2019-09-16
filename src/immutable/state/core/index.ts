import { Record, Map as ImmutableMap } from 'immutable';

import { Connection, ConnectionRecord } from '../../Connection';
import { FetchableData, FetchableDataRecord } from '../../FetchableData';
import { CoreTransactions, CoreTransactionsRecord } from './CoreTransactions';
import { GasPrices, GasPricesRecord } from './GasPrices';
import { Network, NetworkRecord } from './Network';
import { CoreMessages, CoreMessagesRecord } from './Messages';

export * from './GasPrices';
export * from './CoreTransactions';
export * from './Network';
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
