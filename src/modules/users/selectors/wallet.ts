import { createSelector } from 'reselect';

import { WalletKind, WalletMethod } from '~immutable/index';

import { RootStateRecord } from '../../state';
import { USERS_NAMESPACE as ns, USERS_WALLET } from '../constants';

export const walletSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_WALLET]);

export const walletTypeSelector = createSelector(
  walletSelector,
  (wallet) => wallet && wallet.walletType,
);

export const walletKindSelector = createSelector(walletSelector, (wallet) => {
  switch (wallet.walletType) {
    case WalletMethod.MetaMask: {
      return WalletKind.MetaMask;
    }
    case WalletMethod.Create:
    case WalletMethod.Ganache:
    case WalletMethod.Ethereal:
    case WalletMethod.Mnemonic: {
      return WalletKind.Software;
    }
    case WalletMethod.Ledger:
    case WalletMethod.Trezor: {
      return WalletKind.Hardware;
    }
    default: {
      return WalletKind.Software;
    }
  }
});
