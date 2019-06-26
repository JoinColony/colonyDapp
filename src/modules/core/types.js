/* @flow */

import type { SendOptions, ContractResponse } from '@colony/colony-js-client';
import type BigNumber from 'bn.js';

import type { ColonyContext, TransactionReceipt } from '~types';
import type {
  TransactionEventData,
  TransactionMultisig,
  TransactionParams,
} from '~immutable';

export type Sender = {
  client: {
    adapter: {
      provider: {
        getGasPrice: () => Promise<BigNumber>,
        on: (eventName: string, callback: Function) => void,
        removeListener: (eventName: string, callback: Function) => void,
      },
    },
  },
  send(params: *, options: SendOptions): Promise<ContractResponse<*>>,
  estimate(params: *): Promise<BigNumber>,
  restoreOperation: void,
};

export type MultisigSender = Sender & {
  restoreOperation: (
    operationJSON: string,
  ) => Promise<(options: SendOptions) => Promise<ContractResponse<*>>>,
};

export type TxConfig = {|
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
  params?: TransactionParams,
  ready?: boolean,
|};

export type TransactionResponse = {
  receipt?: TransactionReceipt,
  eventData?: TransactionEventData,
  error?: Error,
};

export type MultisigOperationJSON = {
  nonce: number,
  payload: Object, // MultisigOperationPayload
  signers: Object, // Signers
};
