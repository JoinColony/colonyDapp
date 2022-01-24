import { fork, all } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';

import { TxConfig } from '~types/index';
import { ActionTypes } from '~redux/index';
import {
  ContextModule,
  TEMP_getContext,
  TEMP_setContext,
} from '~context/index';
import { takeFrom } from '~utils/saga/effects';

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
  colonyAddress: string,
  initParams: any[],
  extensionId: string,
  additionalChannels?: {
    [index: string]: Channel | undefined;
  },
) {
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

  yield all(
    Object.keys(channels).map((channelName) =>
      createGroupTransaction(transactionChannels[channelName], {
        identifier: colonyAddress,
        methodName: channelName,
        ...channels[channelName],
      }),
    ),
  );

  yield all(
    Object.keys(transactionChannels).map((id) =>
      takeFrom(
        transactionChannels[id].channel,
        ActionTypes.TRANSACTION_CREATED,
      ),
    ),
  );

  return transactionChannels;
}
