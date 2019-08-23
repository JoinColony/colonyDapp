import {
  RecordOf,
  Collection as CollectionType,
  Map as ImmutableMapType,
} from 'immutable';

import { CoreTransactionsRecord } from './CoreTransactions';
import { GasPricesRecord } from './GasPrices';
import { NetworkRecordType } from './Network';
import { DataRecordType } from '../../Data';
import { CoreMessagesRecord } from './Messages';
import { ConnectionRecordType } from './Connection';

export * from './GasPrices';
export * from './CoreTransactions';
export * from './Network';
export * from './Messages';
export * from './Connection';

export type IpfsDataType = ImmutableMapType<string, DataRecordType<string>>;

export type CoreStateProps = {
  gasPrices: GasPricesRecord;
  transactions: CoreTransactionsRecord;
  network: DataRecordType<NetworkRecordType>;
  ipfsData: IpfsDataType;
  messages: CoreMessagesRecord;
  connection: ConnectionRecordType;
};

export type CoreStateRecord = CollectionType<any, any> &
  RecordOf<CoreStateProps>;
