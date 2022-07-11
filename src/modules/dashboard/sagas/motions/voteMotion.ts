import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';
import { soliditySha3, soliditySha3Raw } from 'web3-utils';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { TEMP_getContext, ContextModule } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';
import { signMessage } from '../../../core/sagas/messages';
import { updateMotionValues } from '../utils';

function* voteMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId, vote },
}: Action<ActionTypes.MOTION_VOTE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    // @NOTE This line exceeds the max-len but there's no prettier solution
    // eslint-disable-next-line max-len
    const votingReputationClient: ExtensionClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const { domainId, rootHash } = yield votingReputationClient.getMotion(
      motionId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      userAddress,
      rootHash,
    );

    /*
     * @NOTE We this to be all in one line (no new lines, or line breaks) since
     * Metamask doesn't play nice with them and will replace them, in the message
     * presented to the user with \n
     */
    // eslint-disable-next-line max-len
    const message = `Sign this message to generate 'salt' entropy. Extension Address: ${
      votingReputationClient.address
    } Motion ID: ${motionId.toNumber()}`;

    const signature = yield signMessage('motionRevealVote', message);
    const hash = soliditySha3(soliditySha3Raw(signature), vote);

    const { voteMotionTransaction } = yield createTransactionChannels(meta.id, [
      'voteMotionTransaction',
    ]);

    const batchKey = 'voteMotion';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(voteMotionTransaction, {
      context: ClientType.VotingReputationClient,
      methodName: 'submitVote',
      identifier: colonyAddress,
      params: [motionId, hash, key, value, branchMask, siblings],
      ready: false,
    });

    yield takeFrom(
      voteMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(voteMotionTransaction.id));

    yield takeFrom(
      voteMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /*
     * Update motion page values
     */
    yield fork(updateMotionValues, colonyAddress, userAddress, motionId);

    yield put<AllActions>({
      type: ActionTypes.MOTION_VOTE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_VOTE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* voteMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_VOTE, voteMotion);
}
