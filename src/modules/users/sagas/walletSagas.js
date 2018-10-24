/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  put,
  takeEvery,
  takeLatest,
  getContext,
  setContext,
} from 'redux-saga/effects';
import { defineMessages } from 'react-intl';

import softwareWallet from '@colony/purser-software';
import metamaskWallet from '@colony/purser-metamask';
import ledgerWallet from '@colony/purser-ledger';
import trezorWallet from '@colony/purser-trezor';

import {
  WALLET_FETCH_ACCOUNTS,
  WALLET_FETCH_ACCOUNTS_ERROR,
  WALLET_FETCHED_ACCOUNTS,
  OPEN_MNEMONIC_WALLET,
  OPEN_METAMASK_WALLET,
  OPEN_HARDWARE_WALLET,
  OPEN_KEYSTORE_WALLET,
  CREATE_WALLET,
  CREATE_WALLET_ERROR,
  WALLET_SET,
  WALLET_SET_ERROR,
} from '../actionTypes';

export const MSG = defineMessages({
  errorOpenMnemonicWallet: {
    id: 'error.wallet.openMnemonic',
    defaultMessage:
      'Could not open the wallet with the provided mnemonic phrase',
  },
  errorOpenKeystoreWallet: {
    id: 'error.wallet.openKeystore',
    defaultMessage:
      'Could not open the wallet with the provided JSON file and password',
  },
});

const hardwareWallets = {
  ledger: ledgerWallet,
  trezor: trezorWallet,
};

function* fetchAccounts(action: Object): Saga<void> {
  const { walletType } = action.payload;

  try {
    const wallet = yield call(hardwareWallets[walletType].open, {
      // TODO: is 100 addresses really what we want?
      addressCount: 100,
    });
    yield put({
      type: WALLET_FETCHED_ACCOUNTS,
      payload: { allAddresses: wallet.otherAddresses },
    });
  } catch (e) {
    yield put({
      type: WALLET_FETCH_ACCOUNTS_ERROR,
      payload: { error: e.message },
    });
  }
}

function* openMnemonicWallet(action: Object): Saga<void> {
  const { connectwalletmnemonic } = action.payload;

  try {
    const currentWallet = yield getContext('currentWallet');
    /*
     * Open the wallet with a mnemonic
     */
    const newMnemonicWallet: Object = yield call(softwareWallet.open, {
      mnemonic: connectwalletmnemonic,
    });
    /*
     * Set the new wallet into the context
     */
    yield call(currentWallet.setNewWallet, newMnemonicWallet);
    /*
     * Set the wallet's address inside the store
     */
    yield put({
      type: WALLET_SET,
      payload: { currentAddress: newMnemonicWallet.address },
    });
  } catch (e) {
    yield put({
      type: WALLET_SET_ERROR,
      payload: { error: e.message },
    });
  }
}

function* openMetamaskWallet(): Saga<void> {
  let newMetamaskWallet: Object;

  try {
    const currentWallet = yield getContext('currentWallet');
    /*
     * Open the metamask wallet
     */
    newMetamaskWallet = yield call(metamaskWallet.open);
    /*
     * Set the new wallet into the context
     */
    yield call(currentWallet.setNewWallet, newMetamaskWallet);
    /*
     * Set the wallet's address inside the store
     */
  } catch (e) {
    yield put({
      type: WALLET_SET_ERROR,
      payload: { error: e.message },
    });
    return;
  }
  yield put({
    type: WALLET_SET,
    payload: { currentAddress: newMetamaskWallet.address },
  });
}

function* openHardwareWallet(action: Object): Saga<void> {
  const { hardwareWalletChoice, method } = action.payload;

  try {
    const wallet = yield call(hardwareWallets[method].open, {
      // TODO: is 100 addresses really what we want?
      addressCount: 100,
    });
    const selectedAddressIndex = wallet.otherAddresses.findIndex(
      address => address === hardwareWalletChoice,
    );

    wallet.setDefaultAddress(selectedAddressIndex);

    yield setContext({ currentWallet: wallet });

    yield put({
      type: WALLET_SET,
      payload: { currentAddress: hardwareWalletChoice },
    });
  } catch (e) {
    yield put({
      type: WALLET_SET_ERROR,
      payload: { error: e.message },
    });
  }
}

function* openKeystoreWallet(action: Object): Saga<void> {
  const { keystore, password } = action.payload;
  let newKeystoreWallet: Object;

  try {
    const currentWallet = yield getContext('currentWallet');
    /*
     * Open the wallet with a mnemonic
     */
    newKeystoreWallet = yield call(softwareWallet.open, {
      keystore,
      password,
    });
    /*
     * Set the new wallet into the context
     */
    yield call(currentWallet.setNewWallet, newKeystoreWallet);
  } catch (e) {
    yield put({
      type: WALLET_SET_ERROR,
      payload: { error: e.message },
    });
    return;
  }
  /*
   * Set the wallet's address inside the store
   */
  yield put({
    type: WALLET_SET,
    payload: { currentAddress: newKeystoreWallet.address },
  });
}

function* createWallet(action: Object): Saga<void> {
  const { mnemonic } = action.payload;
  let newWallet: Object;
  /*
   * Recreate the wallet based on the mnemonic
   */
  try {
    const currentWallet = yield getContext('currentWallet');

    newWallet = yield call(softwareWallet.open, {
      mnemonic,
    });

    /*
     * Set the new wallet into the context
     */
    yield call(currentWallet.setNewWallet, newWallet);
  } catch (error) {
    yield put({
      type: CREATE_WALLET_ERROR,
      payload: error,
    });
    return;
  }
  /*
   * Set the wallet's address inside the store
   */
  yield put({
    type: WALLET_SET,
    payload: { currentAddress: newWallet.address },
  });
}

function* walletSagas(): any {
  yield takeLatest(WALLET_FETCH_ACCOUNTS, fetchAccounts);
  yield takeEvery(OPEN_MNEMONIC_WALLET, openMnemonicWallet);
  yield takeEvery(OPEN_METAMASK_WALLET, openMetamaskWallet);
  yield takeEvery(OPEN_HARDWARE_WALLET, openHardwareWallet);
  yield takeEvery(OPEN_KEYSTORE_WALLET, openKeystoreWallet);
  yield takeEvery(CREATE_WALLET, createWallet);
}

export default walletSagas;
