/* @flow */

import type { SendOptions, ContractResponse } from '@colony/colony-js-client';
import type BigNumber from 'bn.js';

import type { TransactionEventData, TransactionParams } from '~immutable';

import type { TransactionReceipt } from '~types/TransactionReceipt';

import type { AddressOrENSName } from '../lib/ColonyManager/types';

export * from '../lib/ColonyManager/types';
export * from '../lib/database/types';
export * from './TransactionReceipt';
export type KeyPath = [*, *];

export type WithKeyPathDepth1 = {| keyPath: [*] |};
export type WithKeyPathDepth2 = {| keyPath: [*, *] |};

export * from './actions';
export * from './Pick';

// TODO remove
export type UniqueActionWithKeyPath = {
  type: string,
  payload: any,
  meta: {
    id: string,
    keyPath: KeyPath,
  },
  error?: boolean,
};

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
  restoreOperation: void,
};

export type MultisigSender<
  P: TransactionParams,
  E: TransactionEventData,
> = Sender<P, E> & {
  restoreOperation: (
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

// TODO replace with real action types
export type CreateTransactionAction<P: TransactionParams> = {
  type: string,
  payload: {
    context: string,
    identifier?: AddressOrENSName,
    lifecycle: LifecycleActionTypes,
    methodName: string,
    options?: SendOptions,
    params: P,
  },
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

export type TxActionCreatorOptions<P: TransactionParams> = {
  identifier?: AddressOrENSName,
  groupId?: string,
  meta: any,
  multisig?: MultisigOperationJSON,
  params: P,
  options?: SendOptions,
  status?: 'created' | 'ready',
};

export type TxActionCreator<P: TransactionParams> = (
  TxActionCreatorOptions<P>,
) => CreateTransactionAction<P>;

export type WalletMethod =
  | 'metamask'
  | 'trezor'
  | 'ledger'
  | 'mnemonic'
  | 'json'
  | 'trufflepig';
