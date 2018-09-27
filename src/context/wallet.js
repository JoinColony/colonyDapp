/* @flow */

let walletInstance: Object | void;

const walletContext: Object = {
  instance: walletInstance,
  setNewWallet: (newWalletInstance: Object) => {
    walletContext.clearWallet();
    walletContext.instance = newWalletInstance;
  },
  clearWallet: () => {
    walletContext.instance = undefined;
  },
};

export default walletContext;
