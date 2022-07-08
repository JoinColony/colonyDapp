import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getExtensionHash, Extension } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

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
    txChannel = yield call(getTxChannel, metaId);

    let haveToUpdateCoinMachineWhitelist = false;
    if (extensionId === Extension.Whitelist) {
      let coinMachineClient;
      let coinMachineDeprecated;
      /*
       * Only re-write the coin machine's whitelist address, if it matches
       * the address of the whitelist we are uninstalling
       *
       * If it does not, it means the user is using and external whitelist
       * (whitelist from a different colony)
       */
      let coinmachineWhitelistIsSame = false;
      try {
        const whitelistClient = yield colonyManager.getClient(
          ClientType.WhitelistClient,
          colonyAddress,
        );
        coinMachineClient = yield colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );
        coinMachineDeprecated = yield coinMachineClient.getDeprecated();
        coinmachineWhitelistIsSame =
          (yield coinMachineClient.getWhitelist()) === whitelistClient.address;
      } catch (error) {
        /*
         * Silent error since we don't really care about it, but it means
         * that the coin machine client is not installed in the colony
         */
      }
      haveToUpdateCoinMachineWhitelist =
        extensionId === Extension.Whitelist &&
        coinmachineWhitelistIsSame &&
        !!coinMachineClient &&
        !coinMachineDeprecated;
    }

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
