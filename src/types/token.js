/* @flow */

export type TokenType = {
  balance: number,
  tokenIcon?: string,
  tokenName: string,
  id: number,
  isEnabled: boolean,
  isNative: boolean,
  isEth: boolean,
  tokenSymbol: string,
  isBlocked?: boolean,
};
