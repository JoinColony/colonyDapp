/* @flow */

import { OPEN_MNEMONIC_WALLET } from '../actionTypes';

export const openMnemonicWallet = (mnemonic: String) => ({
  type: OPEN_MNEMONIC_WALLET,
  payload: { mnemonic },
});

const walletActionCreators: Object = {
  openMnemonicWallet,
};

export default walletActionCreators;
