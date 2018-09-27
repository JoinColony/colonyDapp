/* @flow */

import { call, put, takeEvery } from 'redux-saga/effects';
import softwareWallet from '@colony/purser-software';
import { defineMessages } from 'react-intl';

import walletContext from '~context/wallet';

import { OPEN_MNEMONIC_WALLET, WALLET_SET } from '../actionTypes';

export const MSG = defineMessages({
  errorOpenMnemonicWallet: {
    id: 'error.wallet.openMnemonic',
    defaultMessage:
      'Could not open the wallet with the provided mnemonic phrase',
  },
});

function* openMnemonicWallet(action: Object): any {
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
     * Set the new wallet in the context
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

function* walletSagas(): any {
  yield takeEvery(OPEN_MNEMONIC_WALLET, openMnemonicWallet);
}

export default walletSagas;
