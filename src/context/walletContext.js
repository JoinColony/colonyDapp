/* @flow */

let walletInstance: Object | void;

const clearWallet = () => {
  walletInstance = undefined;
};

const setNewWallet = (newWalletInstance: Object) => {
  clearWallet();
  walletInstance = newWalletInstance;
};

const walletContext: Object = {
  instance: walletInstance,
  clearWallet,
  setNewWallet,
};

export default walletContext;
