/* @flow */

/*
 * Colony Action Types
 */
export const CREATE_TOKEN = 'CREATE_TOKEN';
export const TOKEN_CREATED = 'TOKEN_CREATED';
export const CREATE_COLONY = 'CREATE_COLONY';
export const COLONY_CREATED = 'COLONY_CREATED';

/*
 * Wallet Action Types
 */
export const SET_NEW_WALLET = 'SET_NEW_WALLET';
export const WALLET_SET = 'WALLET_SET';
export const CLEAR_WALLET = 'CLEAR_WALLET';
export const WALLET_CLEARED = 'WALLET_CLEARED';

export type SetNewWalletAction = {
  type: 'SET_NEW_WALLET',
  payload: { currentAddress: string },
};

export type ClearWalletAction = {
  type: 'CLEAR_WALLET',
};
