import { fork } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';

import { TxConfig } from '~types/index';
import {
  ContextModule,
  TEMP_getContext,
  TEMP_setContext,
} from '~context/index';

import {
  createTransaction,
  createTransactionChannels,
} from '../../../core/sagas';

export type Channel = Omit<TxConfig, 'methodName'>;

export const removeOldExtensionClients = (
  colonyAddress: string,
  extensionId: string,
) => {
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
  // Remove old extensions client if exist
  colonyManager.extensionClients.delete(`${colonyAddress}-${extensionId}`);
  TEMP_setContext(ContextModule.ColonyManager, colonyManager);
};

export const modifyParams = (params, payload) =>
  params.map(({ paramName }) => {
    if (typeof payload[paramName] === 'number') {
      return bigNumberify(String(payload[paramName]));
    }
    return payload[paramName];
  });

export function* setupEnablingGroupTransactions(
  metaId: string,
  initParams: any[],
  extensionId: string,
  additionalChannels?: {
    [index: string]: Channel | undefined;
  },
) {
  try {
    const channels = {
      initialise: {
        context: `${extensionId}Client`,
        params: initParams,
      },
      ...additionalChannels,
    };

    const transactionChannels = yield createTransactionChannels(
      metaId,
      Object.keys(channels),
    );
    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: 'enableExtension',
          id: metaId,
          index,
        },
      });

    return {
      channels,
      transactionChannels,
      createGroupTransaction,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}
