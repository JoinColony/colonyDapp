import { eventChannel } from 'redux-saga';
import { Network } from '@colony/colony-js';

import { call, put, spawn, take } from 'redux-saga/effects';

import {
  create as createSoftwareWallet,
  open as purserOpenSoftwareWallet,
} from '@purser/software';
import {
  open as purserOpenMetaMaskWallet,
  accountChangeHook,
} from '@purser/metamask';
import { addChain } from '@purser/metamask/lib-esm/helpers';

import { WalletMethod } from '~immutable/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';
import { DEFAULT_NETWORK, NETWORK_DATA, TOKEN_DATA } from '~constants';

import { ganacheSignTypedData, metamaskSignTypedData } from './utils';

/**
 * Watch for changes in Metamask account, and log the user out when they happen.
 */
function* metaMaskWatch(walletAddress: Address) {
  const channel = eventChannel((emit) => {
    accountChangeHook((addresses): void => {
      const [selectedAddress] = addresses;
      if (selectedAddress) {
        return emit(createAddress(selectedAddress));
      }
      return undefined;
    });
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

export function* metamaskSwitchNetwork() {
  if (
    DEFAULT_NETWORK === Network.Xdai ||
    DEFAULT_NETWORK === Network.XdaiFork
  ) {
    const {
      name: chainName,
      chainId,
      blockExplorerUrl = '',
      rpcUrl = '',
    } = NETWORK_DATA[Network.Xdai];
    const { name, symbol, decimals } = TOKEN_DATA[Network.Xdai];
    /*
     * @NOTE This method adds a new network to metamask and then switches to it
     * (or tries to anyway)
     *
     * If it exists already (it matches the chainId), then it will just
     * attempt to switch to it
     */
    yield addChain({
      chainId,
      chainName,
      nativeCurrency: {
        name,
        symbol,
        decimals,
      },
      blockExplorerUrls: [blockExplorerUrl],
      rpcUrls: [rpcUrl],
    });
  }
}

function* openMetamaskWallet() {
  const wallet = yield call(purserOpenMetaMaskWallet);
  yield spawn(metaMaskWatch, createAddress(wallet.address));
  yield spawn(metamaskSwitchNetwork);
  wallet.signTypedData = metamaskSignTypedData.bind(wallet);
  return wallet;
}

function* openGanacheWallet({
  payload: { privateKey },
}: Action<ActionTypes.WALLET_CREATE>) {
  const wallet = yield call(purserOpenSoftwareWallet, {
    privateKey,
  });
  wallet.signTypedData = ganacheSignTypedData.bind(wallet);
  return wallet;
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
