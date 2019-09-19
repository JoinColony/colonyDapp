import { SendOptions, ContractResponse } from '@colony/colony-js-client';
import BigNumber from 'bn.js';

import { ContractContexts, TransactionReceipt } from '~types/index';
import {
  TransactionEventData,
  TransactionMultisig,
  TransactionParams,
} from '~immutable/index';

export type Sender = {
  client: {
    adapter: {
      provider: {
        getGasPrice: () => Promise<BigNumber>;
        on: (eventName: string, callback: Function) => void;
        removeListener: (eventName: string, callback: Function) => void;
      };
    };
  };
  send(params: any, options: SendOptions): Promise<ContractResponse<any>>;
  estimate(params: any): Promise<BigNumber>;
  restoreOperation: void;
};

export type MultisigSender = Sender & {
  restoreOperation: (
    operationJSON: string,
  ) => Promise<(options: SendOptions) => Promise<ContractResponse<any>>>;
};

export type TxConfig = {
  context: ContractContexts;
  group?: {
    key: string;
    id: string | string[];
    index: number;
  };
  identifier?: string;
  methodContext?: string;
  methodName: string;
  multisig?: boolean | TransactionMultisig;
  options?: SendOptions;
  params?: TransactionParams;
  ready?: boolean;
};

export type TransactionResponse = {
  receipt?: TransactionReceipt;
  eventData?: TransactionEventData;
  error?: Error;
};

export type MultisigOperationJSON = {
  nonce: number;
  payload: object; // MultisigOperationPayload
  signers: object; // Signers
};
