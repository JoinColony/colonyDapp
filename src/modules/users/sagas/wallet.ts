import { eventChannel } from 'redux-saga';

import { call, put, spawn, take, takeLatest, all } from 'redux-saga/effects';

import { open as openSoftwareWallet } from '@purser/software';
import {
  accountChangeHook,
  open as openMetaMaskWallet,
  MetaMaskInpageProvider,
} from '@purser/metamask';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import { getNetworkClient } from '@colony/colony-js-client';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { DEFAULT_NETWORK } from '~constants';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';
import { create, putError } from '~utils/saga/effects';

import { WALLET_SPECIFICS, WALLET_CATEGORIES } from '~immutable/index';
import { HARDWARE_WALLET_DEFAULT_ADDRESS_COUNT } from '../constants';

const walletOpenFunctions = {
  // Disabled for now
  // ledger: ledgerWallet,
  // trezor: trezorWallet,
  json: openSoftwareWallet,
  mnemonic: openSoftwareWallet,
  metamask: openMetaMaskWallet,
  trufflepig: openSoftwareWallet,
};

function* fetchAddressBalance(address, provider) {
  const checkSumedAddress = yield call(createAddress, address);
  const balance = yield call(
    [provider, provider.getBalance],
    checkSumedAddress,
  );
  return {
    address: checkSumedAddress,
    balance,
  };
}

function* fetchAccounts(action: Action<ActionTypes.WALLET_FETCH_ACCOUNTS>) {
  const { walletType } = action.payload;

  try {
    const { otherAddresses } = yield call(walletOpenFunctions[walletType], {
      addressCount: HARDWARE_WALLET_DEFAULT_ADDRESS_COUNT,
    });

    const {
      adapter: { provider },
    } = yield call(
      getNetworkClient,
      DEFAULT_NETWORK,
      {
        type: WALLET_CATEGORIES.HARDWARE,
        subtype: walletType,
      },
      process.env.INFURA_ID,
      !!process.env.VERBOSE,
    );

    const addressesWithBalance = yield all(
      otherAddresses.map((address) =>
        call(fetchAddressBalance, address, provider),
      ),
    );

    yield put<AllActions>({
      type: ActionTypes.WALLET_FETCH_ACCOUNTS_SUCCESS,
      payload: { allAddresses: addressesWithBalance },
    });
  } catch (err) {
    return yield putError(ActionTypes.WALLET_FETCH_ACCOUNTS_ERROR, err);
  }
  return null;
}

function* openMnemonicWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { connectwalletmnemonic } = action.payload;
  return yield call(openSoftwareWallet, {
    mnemonic: connectwalletmnemonic,
  });
}

/**
 * Watch for changes in Metamask account, and log the user out when they happen.
 */
function* metamaskWatch(walletAddress: Address) {
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
  const wallet = yield call(openMetamaskWallet);
  yield spawn(metamaskWatch, createAddress(wallet.address));
  return wallet;
}

function* openHardwareWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { hardwareWalletChoice, method } = action.payload;
  const wallet = yield call(walletOpenFunctions[method], {
    /**
     * @todo : is 100 addresses really what we want?
     */
    addressCount: 100,
  });
  const selectedAddressIndex = wallet.otherAddresses.findIndex(
    (address) => address === hardwareWalletChoice,
  );
  wallet.setDefaultAddress(selectedAddressIndex);
  return wallet;
}

function* openTrufflepigWallet({
  payload: { accountIndex },
}: Action<ActionTypes.WALLET_CREATE>) {
  const loader = yield create(TrufflepigLoader);
  const { privateKey } = yield call([loader, loader.getAccount], accountIndex);
  return yield call(openSoftwareWallet, {
    privateKey,
  });
}

function* createWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { mnemonic } = action.payload;
  return yield call(openSoftwareWallet, {
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
  const wallet = yield call(softwareWallet.create);
  return {
    ...wallet,
    type: 'ethereal',
  };
}

export function* getWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { method } = action.payload;
  switch (method) {
    case 'create':
      return yield call(createWallet, action);
    case WALLET_SPECIFICS.METAMASK:
      return yield call(openMetamaskWallet);
    case WALLET_SPECIFICS.TREZOR:
      return yield call(openHardwareWallet, action);
    case WALLET_SPECIFICS.LEDGER:
      return yield call(openHardwareWallet, action);
    case WALLET_SPECIFICS.MNEMONIC:
      return yield call(openMnemonicWallet, action);
    case WALLET_SPECIFICS.TRUFFLEPIG:
      return yield call(openTrufflepigWallet, action);
    case WALLET_SPECIFICS.ETHEREAL:
      return yield call(createEtherealWallet);
    default:
      throw new Error(
        `Method ${method} is not recognized for getting a wallet`,
      );
  }
}

export function* setupWalletSagas() {
  yield takeLatest(ActionTypes.WALLET_FETCH_ACCOUNTS, fetchAccounts);
}
