import { ClientType } from '@colony/colony-js';
import Safe from '@gnosis.pm/safe-core-sdk';
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, TEMP_getContext } from '~context/index';
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
import { uploadIfpsAnnotation } from '../utils';
import {
  getRawTransactionData,
  getSafeCoreSDK,
  getSafeTransactionService,
  getSignerAddress,
} from '../utils/safeHelpers';

function* initiateSafeTransactionAction({
  payload: {
    safe: { id: safeAddress },
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
    const senderAddress: string = yield getSignerAddress();
    const safeSDK: Safe | null = yield getSafeCoreSDK(safeAddress);
    const safeTxService = yield getSafeTransactionService();

    if (!safeSDK) {
      throw new Error(
        `Safe ${safeAddress} could not be found on the current network.`,
      );
    }

    /*
     * Currently only takes into account the "raw transaction" form option.
     */
    const rawTransactions = getRawTransactionData(transactions);

    let safeTransactions;
    let options;
    if (rawTransactions.length) {
      safeTransactions = rawTransactions.map((tx) => {
        const transaction: SafeTransactionDataPartial = {
          to: tx.recipient.id,
          data: tx.data,
          value: tx.amount,
        };
        return transaction;
      });

      /*
       * Ensures that subsequent transactions have a different nonce so they can be executed
       * in sequence.
       */
      const nonce = yield safeTxService.getNextNonce(safeAddress);
      options = {
        nonce,
      };
    }

    /*
     * Insert logic for other transaction types here...
     */
    const safeTx = yield safeSDK.createTransaction(safeTransactions, options);
    const safeTxHash = yield safeSDK.getTransactionHash(safeTx);
    const senderSignature = yield safeSDK.signTransactionHash(safeTxHash);
    /*
     * Propose transaction to the Safe Tx Service.
     */
    yield safeTxService.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTx.data,
      safeTxHash,
      senderAddress,
      senderSignature: senderSignature.data,
    });

    /*
     * Once transaction has been successfully proposed, initiate colony action & redirect.
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
      safe,
      annotationMessage,
    });

    yield put(
      transactionAddParams(annotateInitiateSafeTx.id, [
        // Arbitary tx hash to appease `annotateTransaction` contract function
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
