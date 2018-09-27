/* @flow */

let walletInstance: Object | void;

// export const clearWalletContext = () => {
//   walletInstance = undefined;
// };
//
// export const setNewWalletContext = (newWalletInstance: Object) => {
//   console.log('set context', newWalletInstance);
//   clearWalletContext();
//   walletInstance = newWalletInstance;
// };

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
