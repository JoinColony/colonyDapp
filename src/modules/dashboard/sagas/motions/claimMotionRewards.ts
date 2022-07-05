import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';
import { $Values } from 'utility-types';
import { BigNumber } from 'ethers/utils';
import { isEmpty } from 'lodash';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { TEMP_getContext, ContextModule } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { TxConfig } from '~types/index';
import {
  ClaimableStakedMotionsDocument,
  ClaimableStakedMotionsQuery,
  ClaimableStakedMotionsQueryVariables,
  UserBalanceWithLockDocument,
  UserBalanceWithLockQuery,
  UserBalanceWithLockQueryVariables,
} from '~data/generated';

import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';

import { updateMotionValues } from '../utils';

function* claimMotionRewards({
  meta,
  payload: { userAddress, colonyAddress, motionIds },
}: Action<ActionTypes.MOTION_CLAIM>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  try {
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    // @NOTE This line exceeds the max-len but there's no prettier solution
    // eslint-disable-next-line max-len
    const votingReputationClient: ExtensionClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    /*
     * We need to do the claim reward transaction, potentially for both sides,
     * Once for yay and once of nay (if the user staked both sides)
     *
     * To do that we try to estimate both transactions, and the one that fails,
     * we know there are no rewards to be claimed on that side
     */
    const motionWithYAYClaims: BigNumber[] = [];
    const motionWithNAYClaims: BigNumber[] = [];

    yield Promise.all(
      motionIds.map(async (motionId) => {
        try {
          /*
           * @NOTE For some reason colonyJS doesn't export types for the estimate methods
           */
          // @ts-ignore
          await votingReputationClient.estimate.claimRewardWithProofs(
            motionId,
            userAddress,
            1,
          );
          motionWithYAYClaims.push(motionId);
        } catch (error) {
          /*
           * We don't want to handle the error here as we are doing this to
           * inferr the user's reward
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
          await votingReputationClient.estimate.claimRewardWithProofs(
            motionId,
            userAddress,
            0,
          );
          motionWithNAYClaims.push(motionId);
        } catch (error) {
          /*
           * We don't want to handle the error here as we are doing this to
           * inferr the user's reward
           *
           * This is a "cheaper" alternative to looking through events, since
           * this doesn't use so many requests
           */
          // silent error
        }
      }),
    );

    const allMotionClaims = motionWithYAYClaims.concat(motionWithNAYClaims);

    if (isEmpty(allMotionClaims)) {
      throw new Error('A motion with claims needs to be provided');
    }

    const channelNames: string[] = [];

    for (let index = 0; index < allMotionClaims.length; index += 1) {
      channelNames.push(String(index));
    }

    const channels: { [id: string]: ChannelDefinition } = yield call(
      createTransactionChannels,
      meta.id,
      channelNames,
    );

    const createGroupTransaction = (
      { id, index }: $Values<typeof channels>,
      config: TxConfig,
    ) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: 'claimMotionRewards',
          id: meta.id,
          index,
        },
      });

    yield all(
      Object.keys(channels).map((id) =>
        createGroupTransaction(channels[id], {
          context: ClientType.VotingReputationClient,
          methodName: 'claimRewardWithProofs',
          identifier: colonyAddress,
          params: [
            allMotionClaims[id],
            userAddress,
            parseInt(id, 10) > motionWithYAYClaims.length - 1 ? 0 : 1,
          ],
        }),
      ),
    );

    yield all(
      Object.keys(channels).map((id) =>
        takeFrom(channels[id].channel, ActionTypes.TRANSACTION_CREATED),
      ),
    );

    yield all(
      Object.keys(channels).map((id) =>
        takeFrom(channels[id].channel, ActionTypes.TRANSACTION_SUCCEEDED),
      ),
    );

    yield all(
      [
        ...new Set([...motionWithYAYClaims, ...motionWithNAYClaims]),
      ].map((motionId) =>
        fork(updateMotionValues, colonyAddress, userAddress, motionId),
      ),
    );

    yield apolloClient.query<
      ClaimableStakedMotionsQuery,
      ClaimableStakedMotionsQueryVariables
    >({
      query: ClaimableStakedMotionsDocument,
      variables: {
        colonyAddress: colonyAddress.toLowerCase(),
        walletAddress: userAddress.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<
      UserBalanceWithLockQuery,
      UserBalanceWithLockQueryVariables
    >({
      query: UserBalanceWithLockDocument,
      variables: {
        colonyAddress: colonyAddress.toLowerCase(),
        address: userAddress.toLowerCase(),
        tokenAddress: colonyClient.tokenClient.address.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.MOTION_CLAIM_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_CLAIM_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* claimMotionRewardsSaga() {
  yield takeEvery(ActionTypes.MOTION_CLAIM, claimMotionRewards);
}
