/* @flow */

export type TokenIconType = {
  name: string,
  data: string,
};

export type TokenType = {
  balance: number,
  tokenIcon?: TokenIconType,
  id: number,
  isNative: boolean,
  tokenSymbol: string,
};
