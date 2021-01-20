import { eventChannel } from 'redux-saga';

import { call, put, spawn, take } from 'redux-saga/effects';

import {
  create as createSoftwareWallet,
  open as purserOpenSoftwareWallet,
} from '@purser/software';
import { open as purserOpenMetaMaskWallet } from '@purser/metamask';

import { WalletMethod } from '~immutable/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';

/**
 * Watch for changes in Metamask account, and log the user out when they happen.
 */
function* metaMaskWatch(walletAddress: Address) {
  const channel = eventChannel((emit) => {
    /*
     * @NOTE This exists as it's injected by metamask, just that TS doesn't
     * know about it
     */
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum.on('accountsChanged', (accounts) => {
        const [newlySelectedAddress] = accounts;
        emit(createAddress(newlySelectedAddress));
      });
    }
    return () => null;
  });
  let previousAddress = walletAddress;
  while (true) {
    const selectedAddress: Address = yield take(channel);
    if (previousAddress !== selectedAddress) {
      previousAddress = selectedAddress;
      yield put<AllActions>({
        type: ActionTypes.USER_LOGOUT,
      });
    }
  }
}

function* openMetamaskWallet() {
  const wallet = yield call(purserOpenMetaMaskWallet);
  yield spawn(metaMaskWatch, createAddress(wallet.address));
  return wallet;
}

function* openGanacheWallet({
  payload: { privateKey },
}: Action<ActionTypes.WALLET_CREATE>) {
  return yield call(purserOpenSoftwareWallet, {
    privateKey,
  });
}

function* createEtherealWallet() {
  /**
   * @NOTE It would be better if we could create a wallet that is not functional
   * within the etherem ecosystem. Something like: 0x00000...
   *
   * But as it stands we have so many address checks within both the app and the
   * server that to change the logic there would be quite a feat.
   *
   * That being said, we should still plan to change this when we'll have some
   * time for proper maintenance
   */
  const wallet = yield call(createSoftwareWallet);
  return wallet;
}

export function* getWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { method } = action.payload;
  switch (method) {
    case WalletMethod.MetaMask:
      return yield call(openMetamaskWallet);
    case WalletMethod.Ethereal:
      return yield call(createEtherealWallet);
    case WalletMethod.Ganache:
      return yield call(openGanacheWallet, action);
    default:
      throw new Error(
        `Method ${method} is not recognized for getting a wallet`,
      );
  }
}
