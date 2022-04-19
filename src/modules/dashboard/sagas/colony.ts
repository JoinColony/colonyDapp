import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { $Values } from 'utility-types';
import isEmpty from 'lodash/isEmpty';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import {
  ColonyTransfersDocument,
  ColonyTransfersQueryVariables,
  ColonyTransfersQuery,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
  TokenBalancesForDomainsDocument,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { TxConfig } from '~types/index';

import {
  ChannelDefinition,
  createTransaction,
  getTxChannel,
  createTransactionChannels,
} from '../../core/sagas';

function* colonyClaimToken({
  payload: { colonyAddress, tokenAddresses },
  meta,
}: Action<ActionTypes.COLONY_CLAIM_TOKEN>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, meta.id);

    if (isEmpty(tokenAddresses)) {
      throw new Error('Token addresses need to be provided');
    }

    const channelNames: string[] = [];

    for (let index = 0; index < tokenAddresses.length; index += 1) {
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
          key: 'claimIncomingFunds',
          id: meta.id,
          index,
        },
      });

    yield all(
      Object.keys(channels).map((id) =>
        createGroupTransaction(channels[id], {
          context: ClientType.ColonyClient,
          methodName: 'claimColonyFunds',
          identifier: colonyAddress,
          params: [tokenAddresses[id]],
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

    // Refresh relevant values
    yield apolloClient.query<
      ColonyTransfersQuery,
      ColonyTransfersQueryVariables
    >({
      query: ColonyTransfersDocument,
      variables: { address: colonyAddress },
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: { colonyAddress, tokenAddresses },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_CLAIM_TOKEN_SUCCESS,
      payload: { params: { tokenAddresses } },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

export default function* colonySagas() {
  yield takeEvery(ActionTypes.COLONY_CLAIM_TOKEN, colonyClaimToken);
}
