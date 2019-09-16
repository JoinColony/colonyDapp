import {
  RecordOf,
  Collection as CollectionType,
  Map as ImmutableMapType,
} from 'immutable';

import { ConnectionRecord } from '../../Connection';
import { FetchableDataRecord } from '../../FetchableData';
import { CoreTransactionsRecord } from './CoreTransactions';
import { GasPricesRecord } from './GasPrices';
import { NetworkRecordType } from './Network';
import { CoreMessagesRecord } from './Messages';

export * from './GasPrices';
export * from './CoreTransactions';
export * from './Network';
export * from './Messages';

export type IpfsDataType = ImmutableMapType<
  string,
  FetchableDataRecord<string>
>;

export type CoreStateProps = {
  gasPrices: GasPricesRecord;
  transactions: CoreTransactionsRecord;
  network: FetchableDataRecord<NetworkRecordType>;
  ipfsData: IpfsDataType;
  messages: CoreMessagesRecord;
  connection: ConnectionRecord;
};

export type CoreStateRecord = CollectionType<any, any> &
  RecordOf<CoreStateProps>;
