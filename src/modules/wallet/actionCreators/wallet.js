/* @flow */

import {
  OPEN_MNEMONIC_WALLET,
  OPEN_METAMASK_WALLET,
  OPEN_HARDWARE_WALLET,
} from '../actionTypes';

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

export const openHardwareWallet = (
  selectedAddress: String,
  handleDidConnectWallet: () => void,
) => ({
  type: OPEN_HARDWARE_WALLET,
  payload: { selectedAddress },
  handleDidConnectWallet,
});
