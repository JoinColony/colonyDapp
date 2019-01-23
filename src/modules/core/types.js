/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { SendOptions, ContractResponse } from '@colony/colony-js-client';
import type BigNumber from 'bn.js';
import type { Map as ImmutableMapType, RecordOf } from 'immutable';

import type {
  AddressOrENSName,
  ColonyContext,
  TransactionReceipt,
} from '~types';
import type {
  TransactionEventData,
  TransactionId,
  TransactionParams,
  TransactionRecord,
} from '~immutable';

import ns from './namespace';

// Gas prices in wei
export type GasPrices = {
  cheaper?: BigNumber,
  cheaperWait?: number,
  faster?: BigNumber,
  fasterWait?: number,
  suggested?: BigNumber,
  suggestedWait?: number,
  network?: BigNumber,
  timestamp?: number,
};

export type TransactionsStateProps = {
  list: ImmutableMapType<TransactionId, TransactionRecord<*, *>>,
  gasPrices: GasPrices,
};

export type TransactionsState = RecordOf<TransactionsStateProps>;

export type CoreState = {|
  [typeof ns]: {|
    transactions: TransactionsState,
  |},
|};

export type Sender<P: TransactionParams, E: TransactionEventData> = {
  client: {
    adapter: {
      provider: {
        getGasPrice: () => Promise<BigNumber>,
        on: (eventName: string, callback: Function) => void,
        removeListener: (eventName: string, callback: Function) => void,
      },
    },
  },
  send(params: P, options: SendOptions): Promise<ContractResponse<E>>,
  estimate(params: P): Promise<BigNumber>,
  restoreOperation?: (
    operationJSON: string,
  ) => Promise<(options: SendOptions) => Promise<ContractResponse<E>>>,
};

export type LifecycleActionTypes = {
  created?: string,
  error?: string,
  receiptReceived?: string,
  sent?: string,
  success?: string,
};

export type CreateTransactionAction<P: TransactionParams> = {
  type: string,
  payload: {
    context: ColonyContext,
    identifier?: AddressOrENSName,
    lifecycle: LifecycleActionTypes,
    methodName: string,
    options?: SendOptions,
    params: P,
  },
  meta: { id: string },
};

export type SendTransactionAction = {
  type: string,
  meta: { id: string },
};

export type MultisigTransactionAction = {
  meta: { id: string },
};

export type TransactionResponse<E: TransactionEventData> = {
  receipt?: TransactionReceipt,
  eventData?: E,
  error?: Error,
};

export type MultisigOperationJSON = {
  nonce: number,
  payload: Object, // MultisigOperationPayload
  signers: Object, // Signers
};
