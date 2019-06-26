/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';
import type { SendOptions } from '@colony/colony-js-client';
import type BigNumber from 'bn.js/lib/bn';

import { Record, List } from 'immutable';

import type {
  Address,
  AddressOrENSName,
  ColonyContext,
  TransactionReceipt,
} from '~types';

export type TransactionError = {|
  type:
    | 'eventData'
    | 'multisigNonce'
    | 'multisigRefresh'
    | 'multisigReject'
    | 'multisigSign'
    | 'receipt'
    | 'send'
    | 'unsuccessful',
  message: string,
|};

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

type Shared = {|
  context: ColonyContext,
  createdAt: Date,
  eventData?: TransactionEventData,
  from: string,
  gasLimit?: number,
  gasPrice?: BigNumber,
  group?: {
    key: string,
    id: string | string[],
    index: number,
  },
  hash?: string,
  id: TransactionId,
  identifier?: AddressOrENSName,
  methodContext?: string, // Context in which method is used e.g. setOneTxRole
  methodName: string,
  multisig?: TransactionMultisig, // Indicates tx is multisig if set
  options: SendOptions,
  params: TransactionParams,
  receipt?: TransactionReceipt,
  status: 'created' | 'ready' | 'pending' | 'failed' | 'multisig' | 'succeeded',
|};

type TransactionRecordProps = {|
  ...Shared,
  errors: List<TransactionError>,
|};

export type TransactionType = $ReadOnly<{|
  ...Shared,
  errors: Array<TransactionError>,
|}>;

export type TransactionRecordType = RecordOf<TransactionRecordProps>;

const defaultValues: $Shape<TransactionRecordProps> = {
  context: undefined,
  createdAt: new Date(),
  errors: new List(),
  eventData: undefined,
  from: undefined,
  gasLimit: undefined,
  gasPrice: undefined,
  group: undefined,
  hash: undefined,
  id: undefined,
  identifier: undefined,
  methodContext: undefined,
  methodName: undefined,
  multisig: undefined,
  options: {},
  params: {},
  receipt: undefined,
  status: 'ready',
};

const TransactionRecord: RecordFactory<TransactionRecordProps> = Record(
  defaultValues,
);

export default TransactionRecord;
