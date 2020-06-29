import { Record, Map as ImmutableMap } from 'immutable';

import {
  Connection,
  ConnectionRecord,
  FetchableData,
  FetchableDataRecord,
  FetchableDataType,
  GasPrices,
  GasPricesRecord,
  NetworkRecord,
} from '~immutable/index';

import {
  CORE_CONNECTION,
  CORE_GAS_PRICES,
  CORE_IPFS_DATA,
  CORE_MESSAGES,
  CORE_NETWORK,
  CORE_TRANSACTIONS,
} from '../constants';
import { CoreTransactions, CoreTransactionsRecord } from './CoreTransactions';
import { CoreMessages, CoreMessagesRecord } from './Messages';

export * from './CoreTransactions';
export * from './Messages';

export type IpfsDataType = ImmutableMap<string, FetchableDataRecord<string>> & {
  toJS(): { [hash: string]: FetchableDataType<string> };
};

type CoreStateProps = {
  [CORE_CONNECTION]: ConnectionRecord;
  [CORE_GAS_PRICES]: GasPricesRecord;
  [CORE_IPFS_DATA]: IpfsDataType;
  [CORE_MESSAGES]: CoreMessagesRecord;
  [CORE_NETWORK]: FetchableDataRecord<NetworkRecord>;
  [CORE_TRANSACTIONS]: CoreTransactionsRecord;
};

export class CoreStateRecord extends Record<CoreStateProps>({
  [CORE_CONNECTION]: Connection(),
  [CORE_GAS_PRICES]: GasPrices(),
  [CORE_IPFS_DATA]: ImmutableMap() as IpfsDataType,
  [CORE_MESSAGES]: CoreMessages(),
  [CORE_NETWORK]: FetchableData(),
  [CORE_TRANSACTIONS]: CoreTransactions(),
}) {}
