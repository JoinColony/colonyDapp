import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';
import { BigNumber } from 'ethers/utils';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { TEMP_getContext, ContextModule } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { Address } from '~types/index';
import {
  MotionStakesQuery,
  MotionStakesQueryVariables,
  MotionStakesDocument,
  EventsForMotionQuery,
  EventsForMotionQueryVariables,
  EventsForMotionDocument,
  MotionsSystemMessagesQuery,
  MotionsSystemMessagesQueryVariables,
  MotionsSystemMessagesDocument,
} from '~data/index';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../core/sagas';

import { transactionReady } from '../../core/actionCreators';

export function* updateCacheValues(
  colonyAddress: Address,
  userAddress: Address,
  motionId: BigNumber,
) {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  /*
   * Staking values
   */
  yield apolloClient.query<MotionStakesQuery, MotionStakesQueryVariables>({
    query: MotionStakesDocument,
    variables: {
      colonyAddress,
      userAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Motion Events
   */
  yield apolloClient.query<EventsForMotionQuery, EventsForMotionQueryVariables>(
    {
      query: EventsForMotionDocument,
      variables: {
        colonyAddress,
        motionId: motionId.toNumber(),
      },
      fetchPolicy: 'network-only',
    },
  );

  /*
   * Motion System Messages
   */
  yield apolloClient.query<
    MotionsSystemMessagesQuery,
    MotionsSystemMessagesQueryVariables
  >({
    query: MotionsSystemMessagesDocument,
    variables: {
      colonyAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });
}

function* stakeMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId, vote, amount },
}: Action<ActionTypes.COLONY_MOTION_STAKE>) {
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

    const {
      approveStake,
      stakeMotionTransaction,
    } = yield createTransactionChannels(meta.id, [
      'approveStake',
      'stakeMotionTransaction',
    ]);

    const batchKey = 'stakeMotion';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(approveStake, {
      context: ClientType.ColonyClient,
      methodName: 'approveStake',
      identifier: colonyAddress,
      params: [votingReputationClient.address, domainId, amount],
      ready: false,
    });

    yield createGroupTransaction(stakeMotionTransaction, {
      context: ClientType.VotingReputationClient,
      methodName: 'stakeMotionWithProofs',
      identifier: colonyAddress,
      params: [motionId, vote, amount, key, value, branchMask, siblings],
      ready: false,
    });

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(approveStake.id));

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(stakeMotionTransaction.id));

    yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /*
     * Update motion page values
     */
    yield fork(updateCacheValues, colonyAddress, userAddress, motionId);

    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_STAKE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_MOTION_STAKE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* motionSagas() {
  yield takeEvery(ActionTypes.COLONY_MOTION_STAKE, stakeMotion);
}
