import { eventChannel } from 'redux-saga';

import { call, put, spawn, take, takeLatest, all } from 'redux-saga/effects';

import softwareWallet from '@colony/purser-software';
import metamaskWallet, { accountChangeHook } from '@colony/purser-metamask';
import ledgerWallet from '@colony/purser-ledger';
import trezorWallet from '@colony/purser-trezor';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import { getNetworkClient } from '@colony/colony-js-client';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { Address, createAddress } from '~types/index';

import { create, putError } from '~utils/saga/effects';

import { WALLET_SPECIFICS, WALLET_CATEGORIES } from '~immutable/index';
import { HARDWARE_WALLET_DEFAULT_ADDRESS_COUNT } from '../constants';
import { DEFAULT_NETWORK } from '../../core/constants';

// This should be typed better
type WalletInstance = object;

const hardwareWallets = {
  ledger: ledgerWallet,
  trezor: trezorWallet,
  json: softwareWallet,
  mnemonic: softwareWallet,
  metamask: metamaskWallet,
  trufflepig: softwareWallet,
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
    const { otherAddresses } = yield call(hardwareWallets[walletType].open, {
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
      otherAddresses.map(address =>
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
  return yield call(softwareWallet.open, {
    mnemonic: connectwalletmnemonic,
  });
}

/**
 * Watch for changes in Metamask account, and log the user out when they happen.
 */
function* metamaskWatch(walletAddress: Address) {
  const channel = eventChannel(emit => {
    accountChangeHook(({ selectedAddress }: { selectedAddress: string }) =>
      emit(createAddress(selectedAddress)),
    );
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
  const wallet = yield call(metamaskWallet.open);
  yield spawn(metamaskWatch, createAddress(wallet.address));
  return wallet;
}

function* openHardwareWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { hardwareWalletChoice, method } = action.payload;
  const wallet = yield call(hardwareWallets[method].open, {
    /**
     * @todo : is 100 addresses really what we want?
     */
    addressCount: 100,
  });
  const selectedAddressIndex = wallet.otherAddresses.findIndex(
    address => address === hardwareWalletChoice,
  );
  wallet.setDefaultAddress(selectedAddressIndex);
  return wallet;
}

function* openKeystoreWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { keystore, password } = action.payload;
  return yield call(softwareWallet.open, {
    keystore,
    password,
  });
}

function* openTrufflepigWallet({
  payload: { accountIndex },
}: Action<ActionTypes.WALLET_CREATE>) {
  const loader = yield create(TrufflepigLoader);
  const { privateKey } = yield call([loader, loader.getAccount], accountIndex);
  return yield call(softwareWallet.open, {
    privateKey,
  });
}

function* createWallet(action: Action<ActionTypes.WALLET_CREATE>) {
  const { mnemonic } = action.payload;
  return yield call(softwareWallet.open, {
    mnemonic,
  });
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
    case WALLET_SPECIFICS.JSON:
      return yield call(openKeystoreWallet, action);
    case WALLET_SPECIFICS.TRUFFLEPIG:
      return yield call(openTrufflepigWallet, action);
    default:
      throw new Error(
        `Method ${method} is not recognized for getting a wallet`,
      );
  }
}

export function* setupWalletSagas() {
  yield takeLatest(ActionTypes.WALLET_FETCH_ACCOUNTS, fetchAccounts);
}
