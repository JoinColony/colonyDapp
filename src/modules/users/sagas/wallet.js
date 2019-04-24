/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeLatest } from 'redux-saga/effects';

import softwareWallet from '@colony/purser-software';
import metamaskWallet from '@colony/purser-metamask';
import ledgerWallet from '@colony/purser-ledger';
import trezorWallet from '@colony/purser-trezor';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';

import type { Action } from '~redux';

import { create, putError } from '~utils/saga/effects';
import { ACTIONS } from '~redux';

// This should be typed better
type WalletInstance = Object;

const hardwareWallets = {
  ledger: ledgerWallet,
  trezor: trezorWallet,
};

function* fetchAccounts(
  action: Action<typeof ACTIONS.WALLET_FETCH_ACCOUNTS>,
): Saga<void> {
  const { walletType } = action.payload;

  try {
    const wallet = yield call(hardwareWallets[walletType].open, {
      /**
       * @todo Determine proper `addressCount` for fetching wallet accounts
       */
      addressCount: 100,
    });
    yield put<Action<typeof ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS>>({
      type: ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS,
      payload: { allAddresses: wallet.otherAddresses },
    });
  } catch (err) {
    yield putError(ACTIONS.WALLET_FETCH_ACCOUNTS_ERROR, err);
  }
}

function* openMnemonicWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<void> {
  const { connectwalletmnemonic } = action.payload;
  return yield call(softwareWallet.open, {
    mnemonic: connectwalletmnemonic,
  });
}

function* openMetamaskWallet(): Saga<void> {
  return yield call(metamaskWallet.open);
}

function* openHardwareWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<void> {
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

function* openKeystoreWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<void> {
  const { keystore, password } = action.payload;
  return yield call(softwareWallet.open, {
    keystore,
    password,
  });
}

function* openTrufflepigWallet({
  payload: { accountIndex },
}: Action<typeof ACTIONS.WALLET_CREATE>): Saga<void> {
  const loader = yield create(TrufflepigLoader);
  const { privateKey } = yield call([loader, loader.getAccount], accountIndex);
  return yield call(softwareWallet.open, {
    privateKey,
  });
}

function* createWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<void> {
  const { mnemonic } = action.payload;
  return yield call(softwareWallet.open, {
    mnemonic,
  });
}

export function* getWallet(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<WalletInstance> {
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
    case 'trufflepig':
      return yield call(openTrufflepigWallet, action);
    default:
      throw new Error(
        `Method ${method} is not recognized for getting a wallet`,
      );
  }
}

export function* setupWalletSagas(): Saga<void> {
  yield takeLatest(ACTIONS.WALLET_FETCH_ACCOUNTS, fetchAccounts);
}
