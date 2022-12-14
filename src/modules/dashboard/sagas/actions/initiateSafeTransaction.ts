import { ClientType } from '@colony/colony-js';
import { fill } from 'lodash';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, TEMP_getContext } from '~context/index';
import { TransactionTypes } from '~dashboard/Dialogs/ControlSafeDialog/constants';
import {
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
} from '~data/generated';
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
import { ActionTypes } from '~redux/actionTypes';
import { Action, AllActions } from '~redux/types';
import { putError, routeRedirect, takeFrom } from '~utils/saga/effects';

import { ipfsUploadAnnotation } from '../utils';
import {
  getRawTransactionData,
  getTransferNFTData,
  getTransferFundsData,
  getContractInteractionData,
  getZodiacModule,
  onLocalDevEnvironment,
  getHomeBridgeByChain,
} from '../utils/safeHelpers';

function* initiateSafeTransactionAction({
  payload: {
    safe,
    transactions,
    transactionsTitle: title,
    colonyAddress,
    colonyName,
    annotationMessage = null,
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
    const homeBridge = getHomeBridgeByChain(safe.chainId);
    const zodiacBridgeModule = getZodiacModule(
      ZODIAC_BRIDGE_MODULE_ADDRESS,
      safe,
    );

    const transactionData: string[] = [];
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
        case TransactionTypes.TRANSFER_FUNDS:
          txDataToBeSentToZodiacModule = yield getTransferFundsData(
            zodiacBridgeModule,
            safe,
            transaction,
          );
          break;
        case TransactionTypes.CONTRACT_INTERACTION:
          txDataToBeSentToZodiacModule = yield getContractInteractionData(
            zodiacBridgeModule,
            safe,
            transaction,
          );
          break;
        default:
          throw new Error(
            `Unknown transaction type: ${transaction.transactionType}`,
          );
      }

      /* eslint-disable-next-line max-len */
      const txDataToBeSentToAMB = yield homeBridge.interface.functions.requireToPassMessage.encode(
        [zodiacBridgeModule.address, txDataToBeSentToZodiacModule, 1000000],
      );

      transactionData.push(txDataToBeSentToAMB);
    }

    const batchKey = 'initiateSafeTransaction';

    const {
      initiateSafeTransaction,
      annotateInitiateSafeTransaction,
    } = yield createTransactionChannels(metaId, [
      'initiateSafeTransaction',
      'annotateInitiateSafeTransaction',
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

    yield createGroupTransaction(initiateSafeTransaction, {
      context: ClientType.ColonyClient,
      methodName: 'makeArbitraryTransactions',
      identifier: colonyAddress,
      params: [
        fill(Array(transactionData.length), homeBridge.address),
        transactionData,
        true,
      ],
      ready: false,
      titleValues: { title },
    });

    yield createGroupTransaction(annotateInitiateSafeTransaction, {
      context: ClientType.ColonyClient,
      methodName: 'annotateTransaction',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield takeFrom(
      annotateInitiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(initiateSafeTransaction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    yield put(transactionPending(annotateInitiateSafeTransaction.id));

    const safeTransactionData = JSON.stringify({
      title,
      transactions,
      annotationMessage,
      safeData: {
        contractAddress: safe.contractAddress,
        chainId: safe.chainId,
      },
    });

    let annotationMessageIpfsHash = null;
    annotationMessageIpfsHash = yield call(
      ipfsUploadAnnotation,
      safeTransactionData,
    );

    yield put(
      transactionAddParams(annotateInitiateSafeTransaction.id, [
        txHash,
        annotationMessageIpfsHash,
      ]),
    );

    yield put(transactionReady(annotateInitiateSafeTransaction.id));

    yield takeFrom(
      annotateInitiateSafeTransaction.channel,
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
