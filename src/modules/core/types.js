/* @flow */

import type { SendOptions, ContractResponse } from '@colony/colony-js-client';
import type BigNumber from 'bn.js';

import type { ColonyContext, TransactionReceipt } from '~types';
import type {
  TransactionEventData,
  TransactionMultisig,
  TransactionParams,
} from '~immutable';

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

export type TxConfig<P> = {|
  context: ColonyContext,
  group?: {|
    key: string,
    id: string | string[],
    index: number,
  |},
  identifier?: string,
  methodContext?: string,
  methodName: string,
  multisig?: boolean | TransactionMultisig,
  options?: SendOptions,
  params?: P,
  ready?: boolean,
|};

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
