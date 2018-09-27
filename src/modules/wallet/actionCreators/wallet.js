/* @flow */

import { OPEN_MNEMONIC_WALLET, OPEN_METAMASK_WALLET } from '../actionTypes';

export const openMnemonicWallet = (
  mnemonic: String,
  setErrors: () => void,
  setSubmitting: () => void,
  handleDidConnectWallet: () => void,
) => ({
  type: OPEN_MNEMONIC_WALLET,
  payload: { mnemonic },
  setErrors,
  setSubmitting,
  handleDidConnectWallet,
});

export const openMetamaskWallet = (handleDidConnectWallet: () => void) => ({
  type: OPEN_METAMASK_WALLET,
  handleDidConnectWallet,
});
