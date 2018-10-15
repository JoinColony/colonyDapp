/* @flow */

export type TokenIcon = {
  name: string,
  data: string,
};

export type Token = {
  balance: number,
  tokenIcon?: TokenIcon,
  id: number,
  isNative: boolean,
  tokenSymbol: string,
};
