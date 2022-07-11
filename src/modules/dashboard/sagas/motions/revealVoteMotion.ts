import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';
import { soliditySha3Raw } from 'web3-utils';

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

function* revealVoteMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId },
}: Action<ActionTypes.MOTION_REVEAL_VOTE>) {
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
    const salt = soliditySha3Raw(signature);

    /*
     * Infferr which side the user voted based on the same salt
     */
    let sideVoted;
    try {
      /*
       * @NOTE For some reason colonyJS doesn't export types for the estimate methods
       */
      // @ts-ignore
      yield votingReputationClient.estimate.revealVote(
        motionId,
        salt,
        0,
        key,
        value,
        branchMask,
        siblings,
      );
      sideVoted = 0;
    } catch (error) {
      /*
       * We don't want to handle the error here as we are doing this to
       * inferr the user's voting choice
       *
       * This is a "cheaper" alternative to looking through events, since
       * this doesn't use so many requests
       */
      // silent error
    }
    try {
      /*
       * @NOTE For some reason colonyJS doesn't export types for the estimate methods
       */
      // @ts-ignore
      yield votingReputationClient.estimate.revealVote(
        motionId,
        salt,
        1,
        key,
        value,
        branchMask,
        siblings,
      );
      sideVoted = 1;
    } catch (error) {
      /*
       * We don't want to handle the error here as we are doing this to
       * inferr the user's voting choice
       *
       * This is a "cheaper" alternative to looking through events, since
       * this doesn't use so many requests
       */
      // silent error
    }
    if (sideVoted !== undefined) {
      const {
        revealVoteMotionTransaction,
      } = yield createTransactionChannels(meta.id, [
        'revealVoteMotionTransaction',
      ]);

      const batchKey = 'revealVoteMotion';

      const createGroupTransaction = ({ id, index }, config) =>
        fork(createTransaction, id, {
          ...config,
          group: {
            key: batchKey,
            id: meta.id,
            index,
          },
        });

      yield createGroupTransaction(revealVoteMotionTransaction, {
        context: ClientType.VotingReputationClient,
        methodName: 'revealVote',
        identifier: colonyAddress,
        params: [motionId, salt, sideVoted, key, value, branchMask, siblings],
        ready: false,
      });

      yield takeFrom(
        revealVoteMotionTransaction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );

      yield put(transactionReady(revealVoteMotionTransaction.id));

      yield takeFrom(
        revealVoteMotionTransaction.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );

      /*
       * Update motion page values
       */
      yield fork(updateMotionValues, colonyAddress, userAddress, motionId);

      return yield put<AllActions>({
        type: ActionTypes.MOTION_REVEAL_VOTE_SUCCESS,
        meta,
      });
    }
    return yield putError(
      ActionTypes.MOTION_REVEAL_VOTE_ERROR,
      new Error('User did not submit standard vote value'),
      meta,
    );
  } catch (error) {
    return yield putError(ActionTypes.MOTION_REVEAL_VOTE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* revealVoteMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_REVEAL_VOTE, revealVoteMotion);
}
