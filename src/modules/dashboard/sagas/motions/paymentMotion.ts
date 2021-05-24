import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  ColonyRole,
  getPermissionProofs,
  getExtensionPermissionProofs,
} from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';

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

function* createPaymentMotion({
  payload: {
    colonyAddress,
    colonyName,
    recipientAddress,
    domainId,
    singlePayment,
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_MOTION_EXPENDITURE_PAYMENT>) {
  let txChannel;
  try {
    /*
     * Validate the required values for the payment
     */
    if (!recipientAddress) {
      throw new Error('Recipient not assigned for OneTxPayment transaction');
    }
    if (!domainId) {
      throw new Error('Domain not set for OneTxPayment transaction');
    }
    if (!singlePayment) {
      throw new Error('Payment details not set for OneTxPayment transaction');
    } else {
      if (!singlePayment.amount) {
        throw new Error('Payment amount not set for OneTxPayment transaction');
      }
      if (!singlePayment.tokenAddress) {
        throw new Error('Payment token not set for OneTxPayment transaction');
      }
      if (!singlePayment.decimals) {
        throw new Error(
          'Payment token decimals not set for OneTxPayment transaction',
        );
      }
    }

    const context = TEMP_getContext(ContextModule.ColonyManager);
    const client = yield context.getClient(
      ClientType.OneTxPaymentClient,
      colonyAddress,
    );

    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient,
      domainId,
      ColonyRole.Funding,
    );

    const [extensionPDID, extensionCSI] = yield call(
      getExtensionPermissionProofs,
      colonyClient,
      domainId,
      client.address,
    );

    const [userPDID, userCSI] = yield call(
      getExtensionPermissionProofs,
      colonyClient,
      domainId,
    );

    const { amount, tokenAddress, decimals = 18 } = singlePayment;

    // eslint-disable-next-line max-len
    const encodedAction = client.interface.functions.makePaymentFundedFromDomain.encode(
      [
        extensionPDID,
        extensionCSI,
        userPDID,
        userCSI,
        [recipientAddress],
        [tokenAddress],
        [bigNumberify(moveDecimal(amount, decimals))],
        domainId,
        /*
         * NOTE Always make the payment in the global skill 0
         * This will make it so that the user only receives reputation in the
         * above domain, but none in the skill itself.
         */
        0,
      ],
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const {
      createMotion,
      annotatePaymentMotion,
    } = yield createTransactionChannels(metaId, [
      'createMotion',
      'annotatePaymentMotion',
    ]);

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        domainId,
        childSkillIndex,
        client.address,
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotatePaymentMotion.id, {
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

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotatePaymentMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotatePaymentMotion.id));

      let ipfsHash = null;
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

      yield put(
        transactionAddParams(annotatePaymentMotion.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotatePaymentMotion.id));

      yield takeFrom(
        annotatePaymentMotion.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }
    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_EXPENDITURE_PAYMENT_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(
      ActionTypes.COLONY_MOTION_EXPENDITURE_PAYMENT_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

export default function* paymentMotionSaga() {
  yield takeEvery(
    ActionTypes.COLONY_MOTION_EXPENDITURE_PAYMENT,
    createPaymentMotion,
  );
}
