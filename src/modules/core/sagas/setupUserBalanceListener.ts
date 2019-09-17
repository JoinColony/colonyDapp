import { eventChannel } from '@redux-saga/core';
import { take, put } from '@redux-saga/core/effects';
import { formatEther } from 'ethers/utils';

import { Context, getContext } from '~context/index';
import { Address } from '~types/strings';
import { AllActions } from '~redux/types';
import { log } from '~utils/debug';
import { currentUserBalance } from '../../users/actionCreators';

export function* setupUserBalanceListener(walletAddress: Address) {
  let channel;
  try {
    const { networkClient } = yield getContext(Context.COLONY_MANAGER);

    channel = eventChannel(emit => {
      const listener = balance => emit(formatEther(balance));
      networkClient.adapter.provider.on(walletAddress, listener);
      return () => {
        networkClient.adapter.provider.removeListener(walletAddress, listener);
      };
    });

    while (true) {
      const balance = yield take(channel);
      yield put<AllActions>(currentUserBalance(balance));
    }
  } catch (error) {
    log.warn('Error while listening for user balance', error);
  } finally {
    if (channel) channel.close();
  }
}
