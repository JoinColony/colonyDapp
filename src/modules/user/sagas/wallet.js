/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery } from 'redux-saga/effects';
import { defineMessages } from 'react-intl';

import softwareWallet from '@colony/purser-software';
import metamaskWallet from '@colony/purser-metamask';

import walletContext from '~context/wallet';

import {
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

function* openMnemonicWallet(action: Object): Saga<void> {
  const { mnemonic } = action.payload;
  const { setErrors, setSubmitting, handleDidConnectWallet } = action;
  setSubmitting(true);
  try {
    /*
     * Open the wallet with a mnemonic
     */
    const newMnemonicWallet: Object = yield call(softwareWallet.open, {
      mnemonic,
    });
    /*
     * Set the new wallet into the context
     */
    yield call(walletContext.setNewWallet, newMnemonicWallet);
    /*
     * Set the wallet's address inside the store
     */
    yield put({
      type: WALLET_SET,
      payload: { currentAddress: newMnemonicWallet.address },
    });
    setSubmitting(false);
    /*
     * Go to create profile
     */
    handleDidConnectWallet();
  } catch (caughtError) {
    setSubmitting(false);
    setErrors(MSG.errorOpenMnemonicWallet);
  }
}

function* openMetamaskWallet(action: Object): Saga<void> {
  const { handleDidConnectWallet } = action;
  /*
   * Open the metamask wallet
   */
  const newMetamaskWallet: Object = yield call(metamaskWallet.open);
  /*
   * Set the new wallet into the context
   */
  yield call(walletContext.setNewWallet, newMetamaskWallet);
  /*
   * Set the wallet's address inside the store
   */
  yield put({
    type: WALLET_SET,
    payload: { currentAddress: newMetamaskWallet.address },
  });
  /*
   * Go to create profile
   */
  handleDidConnectWallet();
}

function* openHardwareWallet(action: Object): Saga<void> {
  const { selectedAddress } = action.payload;
  const { handleDidConnectWallet } = action;
  /*
   * Set the wallet's address inside the store
   */
  yield put({
    type: WALLET_SET,
    payload: { currentAddress: selectedAddress },
  });
  /*
   * Go to create profile
   */
  handleDidConnectWallet();
}

function* openKeystoreWallet(action: Object): Saga<void> {
  const { keystore, password } = action.payload;
  // const { setErrors, setSubmitting, handleDidConnectWallet } = action;
  // setSubmitting(true);
  try {
    /*
     * Open the wallet with a mnemonic
     */
    const newKeystoreWallet: Object = yield call(softwareWallet.open, {
      keystore,
      password,
    });
    /*
     * Set the new wallet into the context
     */
    yield call(walletContext.setNewWallet, newKeystoreWallet);
    /*
     * Set the wallet's address inside the store
     */
    yield put({
      type: WALLET_SET,
      payload: { currentAddress: newKeystoreWallet.address },
    });
    // setSubmitting(false);
    /*
     * Go to create profile
     */
    // handleDidConnectWallet();
  } catch (caughtError) {
    yield put({
      type: WALLET_SET_ERROR,
      payload: { error: caughtError.message }
    })
    // setSubmitting(false);
    // setErrors(MSG.errorOpenMnemonicWallet);
  }
}

function* createWallet(action: Object): Saga<void> {
  const { mnemonic } = action.payload;
  let newWallet: Object;
  /*
   * Recreate the wallet based on the mnemonic
   */
  try {
    newWallet = yield call(softwareWallet.open, {
      mnemonic,
    });
  } catch (error) {
    yield put({
      type: CREATE_WALLET_ERROR,
      payload: error,
    });
    return;
  }
  /*
   * Set the new wallet into the context
   */
  yield call(walletContext.setNewWallet, newWallet);
  /*
   * Set the wallet's address inside the store
   */
  yield put({
    type: WALLET_SET,
    payload: { currentAddress: newWallet.address },
  });
}

function* walletSagas(): any {
  yield takeEvery(OPEN_MNEMONIC_WALLET, openMnemonicWallet);
  yield takeEvery(OPEN_METAMASK_WALLET, openMetamaskWallet);
  yield takeEvery(OPEN_HARDWARE_WALLET, openHardwareWallet);
  yield takeEvery(OPEN_KEYSTORE_WALLET, openKeystoreWallet);
  yield takeEvery(CREATE_WALLET, createWallet);
}

export default walletSagas;
