import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ROOT_DOMAIN_ID } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { ipfsUpload } from '../../../core/sagas/ipfs';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';

function* mintTokensMotion({
  payload: { colonyAddress, colonyName, amount, annotationMessage },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_MOTION_MINT_TOKENS>) {
  let txChannel;
  try {
    if (!amount) {
      throw new Error(
        'Amount to mint not set for mintTokensMotion transaction',
      );
    }

    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const encodedAction = colonyClient.interface.functions.mintTokens.encode([
      amount,
    ]);

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      ROOT_DOMAIN_ID,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createRootMotion';

    const {
      createRootMotion,
      annotateMintTokens,
    } = yield createTransactionChannels(metaId, [
      'createRootMotion',
      'annotateMintTokens',
    ]);

    // create transactions
    yield fork(createTransaction, createRootMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createRootMotion',
      identifier: colonyAddress,
      params: [AddressZero, encodedAction, key, value, branchMask, siblings],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMintTokens.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createRootMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateMintTokens.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(createRootMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createRootMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createRootMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateMintTokens.id));

      let ipfsHash = null;
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

      yield put(
        transactionAddParams(annotateMintTokens.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotateMintTokens.id));

      yield takeFrom(
        annotateMintTokens.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }
    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_MINT_TOKENS_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.COLONY_MOTION_MINT_TOKENS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* mintTokensMotionSaga() {
  yield takeEvery(ActionTypes.COLONY_MOTION_MINT_TOKENS, mintTokensMotion);
}
