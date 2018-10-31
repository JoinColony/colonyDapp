/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeLatest } from 'redux-saga/effects';

import softwareWallet from '@colony/purser-software';
import metamaskWallet from '@colony/purser-metamask';
import ledgerWallet from '@colony/purser-ledger';
import trezorWallet from '@colony/purser-trezor';

import {
  WALLET_FETCH_ACCOUNTS,
  WALLET_FETCH_ACCOUNTS_ERROR,
  WALLET_FETCH_ACCOUNTS_SUCCESS,
} from '../actionTypes';

// TODO: type better
type WalletInstance = Object;

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
      type: WALLET_FETCH_ACCOUNTS_SUCCESS,
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
  return yield call(softwareWallet.open, {
    mnemonic: connectwalletmnemonic,
  });
}

function* openMetamaskWallet(): Saga<void> {
  return yield call(metamaskWallet.open);
}

function* openHardwareWallet(action: Object): Saga<void> {
  const { hardwareWalletChoice, method } = action.payload;
  const wallet = yield call(hardwareWallets[method].open, {
    // TODO: is 100 addresses really what we want?
    addressCount: 100,
  });
  const selectedAddressIndex = wallet.otherAddresses.findIndex(
    address => address === hardwareWalletChoice,
  );
  wallet.setDefaultAddress(selectedAddressIndex);
  return wallet;
}

function* openKeystoreWallet(action: Object): Saga<void> {
  const { keystore, password } = action.payload;
  return yield call(softwareWallet.open, {
    keystore,
    password,
  });
}

function* createWallet(action: Object): Saga<void> {
  const { mnemonic } = action.payload;
  return yield call(softwareWallet.open, {
    mnemonic,
  });
}

export function* getWallet(action: Object): Saga<WalletInstance> {
  const { method } = action.payload;
  switch (method) {
    case 'create':
      return yield call(createWallet, action);
    case 'metamask':
      return yield call(openMetamaskWallet, action);
    case 'trezor':
      return yield call(openHardwareWallet, action);
    case 'ledger':
      return yield call(openHardwareWallet, action);
    case 'mnemonic':
      return yield call(openMnemonicWallet, action);
    case 'json':
      return yield call(openKeystoreWallet, action);
    default:
      throw new Error(
        `Method ${method} is not recognized for getting a wallet`,
      );
  }
}

function* setupWalletSagas(): any {
  yield takeLatest(WALLET_FETCH_ACCOUNTS, fetchAccounts);
}

export default setupWalletSagas;
