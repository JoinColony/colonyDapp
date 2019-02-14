/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';
import type { SendOptions } from '@colony/colony-js-client';
import type BigNumber from 'bn.js/lib/bn';

import { Record, List } from 'immutable';
import nanoid from 'nanoid';

import type {
  Address,
  AddressOrENSName,
  ColonyContext,
  LifecycleActionTypes,
  TransactionReceipt,
} from '~types';

export type TransactionError = {
  type: 'send' | 'receipt' | 'eventData' | 'unsuccessful',
  message: string,
};

export type TransactionId = string;

export type TransactionParams = Object;

export type TransactionEventData = Object;

export type TransactionMultisig = {|
  missingSignees?: Array<Address>,
  nonce?: number,
  payload?: Object,
  requiredSignees?: Array<Address>,
  signers?: Array<Object>,
|};

type Shared<P: TransactionParams, E: TransactionEventData> = {|
  context: ColonyContext,
  createdAt: Date,
  eventData?: E,
  gasLimit?: BigNumber,
  gasPrice?: BigNumber,
  group?: {
    key: string,
    id: string | string[],
    index: number,
  },
  hash?: string,
  id: TransactionId,
  identifier?: AddressOrENSName,
  lifecycle: LifecycleActionTypes,
  methodName: string,
  multisig?: TransactionMultisig, // Indicates tx is multisig if set
  options: SendOptions,
  params: P,
  receipt?: TransactionReceipt,
  status: 'created' | 'ready' | 'pending' | 'failed' | 'multisig' | 'succeeded',
|};

type TransactionRecordProps<P: TransactionParams, E: TransactionEventData> = {|
  ...Shared<P, E>,
  errors: List<TransactionError>,
|};

export type TransactionType<
  P: TransactionParams,
  E: TransactionEventData,
> = $ReadOnly<{|
  ...Shared<P, E>,
  errors: Array<TransactionError>,
|}>;

export type TransactionRecordType<
  P: TransactionParams,
  E: TransactionEventData,
> = RecordOf<TransactionRecordProps<P, E>>;

const defaultValues: $Shape<TransactionRecordProps<*, *>> = {
  context: undefined,
  createdAt: new Date(),
  errors: new List(),
  eventData: undefined,
  gasLimit: undefined,
  gasPrice: undefined,
  group: undefined,
  hash: undefined,
  id: nanoid(),
  identifier: undefined,
  lifecycle: {},
  methodName: undefined,
  multisig: undefined,
  options: {},
  params: {},
  receipt: undefined,
  status: 'ready',
};

const TransactionRecord: RecordFactory<TransactionRecordProps<*, *>> = Record(
  defaultValues,
);

export default TransactionRecord;
