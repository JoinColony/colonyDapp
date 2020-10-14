import { eventChannel } from 'redux-saga';

import { call, put, spawn, take } from 'redux-saga/effects';

import {
  create as createSoftwareWallet,
  open as purserOpenSoftwareWallet,
} from '@purser/software';
import {
  accountChangeHook,
  open as purserOpenMetaMaskWallet,
  MetaMaskInpageProvider,
} from '@purser/metamask';

import { WalletMethod } from '~immutable/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';

function* openMnemonicWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { connectWalletMnemonic } = action.payload;
  return yield call(purserOpenSoftwareWallet, {
    mnemonic: connectWalletMnemonic,
  });
}

/**
 * Watch for changes in Metamask account, and log the user out when they happen.
 */
function* metaMaskWatch(walletAddress: Address) {
  const channel = eventChannel((emit) => {
    accountChangeHook(({ selectedAddress }: MetaMaskInpageProvider) => {
      if (selectedAddress) emit(createAddress(selectedAddress));
    });
    return () => {
      // @todo Nicer unsubscribe once supported in purser-metamask
      // @ts-ignore
      if (window.web3) {
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        window.web3.currentProvider.publicConfigStore._events.update.pop();
      }
    };
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

function* createWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { mnemonic } = action.payload;
  return yield call(purserOpenSoftwareWallet, {
    mnemonic,
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
    case WalletMethod.Create:
      return yield call(createWallet, action);
    case WalletMethod.MetaMask:
      return yield call(openMetamaskWallet);
    case WalletMethod.Mnemonic:
      return yield call(openMnemonicWallet, action);
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
