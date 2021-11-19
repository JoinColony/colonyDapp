import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getExtensionHash, Extension } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import {
  CoinMachineHasWhitelistQuery,
  CoinMachineHasWhitelistQueryVariables,
  CoinMachineHasWhitelistDocument,
} from '~data/index';
import { Action, ActionTypes } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  createTransaction,
  getTxChannel,
  createTransactionChannels,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';

import { refreshExtension } from '../utils';

export function* colonyExtensionUninstall({
  meta: { id: metaId },
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.COLONY_EXTENSION_UNINSTALL>) {
  let txChannel;
  try {
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    txChannel = yield call(getTxChannel, metaId);

    let coinMachineClient;
    let coinMachineDeprecated;
    try {
      coinMachineClient = yield colonyManager.getClient(
        ClientType.CoinMachineClient,
        colonyAddress,
      );
      coinMachineDeprecated = yield coinMachineClient.getDeprecated();
    } catch (error) {
      /*
       * Silent error since we don't really care about it, but it means
       * that the coin machine client is not installed in the colony
       */
    }
    const haveToUpdateCoinMachineWhitelist =
      extensionId === Extension.Whitelist &&
      !!coinMachineClient &&
      !coinMachineDeprecated;

    const batchKey = 'unistallExtensions';
    const {
      uninstallExtensionTx: uninstallExtension,
      updateCoinMachineWhitelistTx: updateCoinMachineWhitelist,
    } = yield createTransactionChannels(metaId, [
      'uninstallExtensionTx',
      'updateCoinMachineWhitelistTx',
    ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
      });

    yield createGroupTransaction(uninstallExtension, {
      context: ClientType.ColonyClient,
      methodName: 'uninstallExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId)],
      ready: false,
    });

    if (haveToUpdateCoinMachineWhitelist) {
      yield createGroupTransaction(updateCoinMachineWhitelist, {
        context: ClientType.CoinMachineClient,
        methodName: 'setWhitelist',
        identifier: colonyAddress,
        params: [AddressZero],
        ready: false,
      });
    }

    yield takeFrom(uninstallExtension.channel, ActionTypes.TRANSACTION_CREATED);
    if (haveToUpdateCoinMachineWhitelist) {
      yield takeFrom(
        updateCoinMachineWhitelist.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(uninstallExtension.id));
    yield takeFrom(
      uninstallExtension.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    if (haveToUpdateCoinMachineWhitelist) {
      yield put(transactionReady(updateCoinMachineWhitelist.id));
      yield takeFrom(
        updateCoinMachineWhitelist.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    yield call(refreshExtension, colonyAddress, extensionId);

    yield apolloClient.query<
      CoinMachineHasWhitelistQuery,
      CoinMachineHasWhitelistQueryVariables
    >({
      query: CoinMachineHasWhitelistDocument,
      variables: {
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_UNINSTALL_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* colonyExtensionUninstallSaga() {
  yield takeEvery(
    ActionTypes.COLONY_EXTENSION_UNINSTALL,
    colonyExtensionUninstall,
  );
}
