import { eventChannel } from '@redux-saga/core';
import { take } from '@redux-saga/core/effects';
import { formatEther } from 'ethers/utils';

import { TEMP_getContext, ContextModule } from '~context/index';
import { Address } from '~types/index';
import { log } from '~utils/debug';
import {
  SetLoggedInUserDocument,
  SetLoggedInUserMutation,
  SetLoggedInUserMutationVariables,
} from '~data/index';

export function* setupUserBalanceListener(walletAddress: Address) {
  let channel;
  try {
    const { provider } = TEMP_getContext(ContextModule.ColonyManager);
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    channel = eventChannel((emit) => {
      const listener = (balance) => emit(formatEther(balance));
      provider.on(walletAddress, listener);
      return () => {
        provider.removeListener(walletAddress, listener);
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
