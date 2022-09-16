import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ROOT_DOMAIN_ID, getChildIndex } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import {
  ACTION_DECISION_MOTION_CODE,
  LOCAL_STORAGE_DECISION_KEY,
} from '~constants';
import { DecisionDetails } from '~types/index';

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

function* createDecisionMotion({
  payload: {
    colonyName,
    colonyAddress,
    decisionTitle,
    decisionDescription,
    motionDomainId,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.MOTION_CREATE_DECISION>) {
  let txChannel;

  try {
    /*
     * Validate the required values
     */
    if (!colonyAddress) {
      throw new Error('Colony address is required when creating a Decision.');
    }

    if (!decisionTitle) {
      throw new Error('Decision title is required when creating a Decision.');
    }

    if (!motionDomainId) {
      throw new Error('Motion Domain id is required when creating a Decision.');
    }

    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient,
      ROOT_DOMAIN_ID,
      ROOT_DOMAIN_ID,
    );

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
    const batchKey = 'createMotion';

    const {
      createMotion,
      annotateMotion,
    } = yield createTransactionChannels(metaId, [
      'createMotion',
      'annotateMotion',
    ]);

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        ROOT_DOMAIN_ID,
        childSkillIndex,
        AddressZero,
        ACTION_DECISION_MOTION_CODE,
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

    // @NOTE store the Decision details ipfs hash as the annotation hash
    yield fork(createTransaction, annotateMotion.id, {
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

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield put(transactionPending(annotateMotion.id));

    const details: DecisionDetails = {
      title: decisionTitle,
      description: decisionDescription,
      motionDomainId,
    };
    /*
     * Upload Decision details to IPFS
     */
    const decisionIpfsHash = yield call(ipfsUpload, JSON.stringify(details));
    yield put(
      transactionAddParams(annotateMotion.id, [txHash, decisionIpfsHash]),
    );

    yield put(transactionReady(annotateMotion.id));

    yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.MOTION_CREATE_DECISION_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(
        `/colony/${colonyName}/decisions/tx/${txHash}`,
        history,
      );
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_CREATE_DECISION_ERROR, caughtError, meta);
  } finally {
    txChannel.close();

    // remove the local storage decision
    localStorage.removeItem(LOCAL_STORAGE_DECISION_KEY);
  }
}

export default function* createDecisionMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_CREATE_DECISION, createDecisionMotion);
}
