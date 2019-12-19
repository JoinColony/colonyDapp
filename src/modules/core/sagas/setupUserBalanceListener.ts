import ApolloClient from 'apollo-client';
import { eventChannel } from '@redux-saga/core';
import { take } from '@redux-saga/core/effects';
import { formatEther } from 'ethers/utils';

import { Context, getContext } from '~context/index';
import { Address } from '~types/strings';
import { log } from '~utils/debug';
import {
  SetLoggedInUserDocument,
  SetLoggedInUserMutation,
  SetLoggedInUserMutationVariables,
} from '~data/index';

export function* setupUserBalanceListener(walletAddress: Address) {
  let channel;
  try {
    const { networkClient } = yield getContext(Context.COLONY_MANAGER);
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    channel = eventChannel(emit => {
      const listener = balance => emit(formatEther(balance));
      networkClient.adapter.provider.on(walletAddress, listener);
      return () => {
        networkClient.adapter.provider.removeListener(walletAddress, listener);
      };
    });

    while (true) {
      const balance = yield take(channel);
      yield apolloClient.mutate<
        SetLoggedInUserMutation,
        SetLoggedInUserMutationVariables
      >({
        mutation: SetLoggedInUserDocument,
        variables: {
          input: { balance },
        },
      });
    }
  } catch (error) {
    log.warn('Error while listening for user balance', error);
  } finally {
    if (channel) channel.close();
  }
}
