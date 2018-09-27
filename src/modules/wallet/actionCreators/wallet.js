/* @flow */

import { OPEN_MNEMONIC_WALLET } from '../actionTypes';

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

const walletActionCreators: Object = {
  openMnemonicWallet,
};

export default walletActionCreators;
