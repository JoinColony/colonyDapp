/* @flow */

import type { SendOptions, ContractResponse } from '@colony/colony-js-client';

export type Sender<Params: Object> = {
  client: {
    adapter: {
      provider: {
        on: (eventName: string, callback: Function) => void,
        removeListener: (eventName: string, callback: Function) => void,
      },
    },
  },
  send(params: Params, options: SendOptions): Promise<ContractResponse<*>>,
};

export type TransactionAction<Params: Object> = {
  type: string,
  payload: {
    options: SendOptions,
    params: Params,
  },
};
