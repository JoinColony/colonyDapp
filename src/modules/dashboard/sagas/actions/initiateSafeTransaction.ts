import { ClientType, ColonyClient } from '@colony/colony-js';

import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, TEMP_getContext } from '~context/index';
import { TransactionTypes } from '~dashboard/Dialogs/ControlSafeDialog/constants';
import {
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
} from '~data/generated';
import ColonyManager from '~lib/ColonyManager';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~modules/core/actionCreators';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '~modules/core/sagas';
import { getColonyManager } from '~modules/core/sagas/utils';
import { ActionTypes } from '~redux/actionTypes';
import { Action, AllActions } from '~redux/types';
import { putError, routeRedirect, takeFrom } from '~utils/saga/effects';
import { TransactionTypes } from '~dashboard/Dialogs/ControlSafeDialog/constants';
import { uploadIfpsAnnotation } from '../utils';
import {
  getForeignBridgeMock,
  getHomeBridge,
  getRawTransactionData,
  getTransferNFTData,
  getZodiacModule,
  onLocalDevEnvironment,
} from '../utils/safeHelpers';

function* initiateSafeTransactionAction({
  payload: {
    safe,
    transactions,
    transactionsTitle: title,
    colonyAddress,
    colonyName,
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    const ZODIAC_BRIDGE_MODULE_ADDRESS = onLocalDevEnvironment
      ? process.env.ZODIAC_BRIDGE_MODULE_ADDRESS
      : safe.moduleContractAddress;

    if (!ZODIAC_BRIDGE_MODULE_ADDRESS) {
      throw new Error(
        `Please provide a ZODIAC_BRIDGE_MODULE_ADDRESS. If running local, please add key-pair to your .env file.`,
      );
    }
    const homeBridge = getHomeBridge(safe);
    const foreignBridgeMock = getForeignBridgeMock();
    const zodiacBridgeModule = getZodiacModule(
      ZODIAC_BRIDGE_MODULE_ADDRESS,
      safe,
    );

    const colonyManager: ColonyManager = yield getColonyManager();
    const colony: ColonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    /*
     * Calls HomeBridge for each Tx, with the Colony as the sender.
     * Loop necessary as yield cannot be called inside of an array iterator (like forEach).
     */
    /* eslint-disable-next-line no-restricted-syntax */
    for (const transaction of transactions) {
      let txDataToBeSentToZodiacModule = '';
      switch (transaction.transactionType) {
        case TransactionTypes.RAW_TRANSACTION:
          txDataToBeSentToZodiacModule = getRawTransactionData(
            zodiacBridgeModule,
            transaction,
          );
          break;
        case TransactionTypes.TRANSFER_NFT:
          txDataToBeSentToZodiacModule = getTransferNFTData(
            zodiacBridgeModule,
            safe,
            transaction,
          );
          break;
        case TransactionTypes.TRANSFER_FUNDS: // @TODO
        case TransactionTypes.CONTRACT_INTERACTION: // @TODO
        default:
          throw new Error(
            `Unknown transaction type: ${transaction.transactionType}`,
          );
      }

      /*
       * Set up promise that will see it bridged across.
       * Dev mode only.
       */
      let bridgeListener;
      if (foreignBridgeMock) {
        bridgeListener = new Promise<void>((resolve) => {
          foreignBridgeMock.on(
            'RelayedMessage',
            async (_sender, msgSender, _messageId, success) => {
              /* eslint-disable-next-line no-console */
              console.log(
                'bridged with ',
                _sender,
                msgSender,
                _messageId,
                success,
              );
              resolve();
            },
          );
        });
      }

      /* eslint-disable-next-line max-len */
      const txDataToBeSentToAMB = yield homeBridge.interface.functions.requireToPassMessage.encode(
        [zodiacBridgeModule.address, txDataToBeSentToZodiacModule, 1000000],
      );

      yield colony.makeArbitraryTransaction(
        homeBridge.address,
        txDataToBeSentToAMB,
      );

      yield bridgeListener;
    }

    /*
     * Once transactions have all been successfully bridged, initiate colony action & redirect.
     */
    const batchKey = 'initiateSafeTx';

    const {
      annotateInitiateSafeTransactionAction: annotateInitiateSafeTx,
    } = yield createTransactionChannels(metaId, [
      'annotateInitiateSafeTransactionAction',
    ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
          titleValues: { title },
        },
      });

    yield createGroupTransaction(annotateInitiateSafeTx, {
      context: ClientType.ColonyClient,
      methodName: 'annotateTransaction',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    yield takeFrom(
      annotateInitiateSafeTx.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionPending(annotateInitiateSafeTx.id));

    /*
     * Upload all data via annotationMessage to IPFS.
     * This is to avoid storing the data in the colony metadata.
     */
    const annotationMessageIpfsHash = yield call(uploadIfpsAnnotation, {
      title,
      transactions,
      safeData: {
        contractAddress: safe.contractAddress,
        chainId: safe.chainId,
      },
      annotationMessage,
    });

    yield put(
      transactionAddParams(annotateInitiateSafeTx.id, [
        /* Arbitary tx hash to appease `annotateTransaction` contract function */
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        annotationMessageIpfsHash,
      ]),
    );
    yield put(transactionReady(annotateInitiateSafeTx.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      annotateInitiateSafeTx.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      annotateInitiateSafeTx.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /*
     * Update the colony object cache
     */
    yield apolloClient.query<ColonyFromNameQuery, ColonyFromNameQueryVariables>(
      {
        query: ColonyFromNameDocument,
        variables: { name: colonyName || '', address: colonyAddress },
        fetchPolicy: 'network-only',
      },
    );

    yield put<AllActions>({
      type: ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* createInitiateSafeTransactionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION,
    initiateSafeTransactionAction,
  );
}
