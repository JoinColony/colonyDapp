/* @flow */

/*
 * Wallet Action Types
 */
export const SET_NEW_WALLET = 'SET_NEW_WALLET';
export const WALLET_SET = 'WALLET_SET';
export const CLEAR_WALLET = 'CLEAR_WALLET';
export const WALLET_CLEARED = 'WALLET_CLEARED';

export const OPEN_MNEMONIC_WALLET = 'wallet/OPEN_MNEMONIC';

export type SetNewWalletAction = {
  type: 'SET_NEW_WALLET',
  payload: { currentAddress: string },
};

export type ClearWalletAction = {
  type: 'CLEAR_WALLET',
};
