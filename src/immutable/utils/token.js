/* @flow */

import type { TokenType, TokenRecordType } from '../Token';

// TODO consider moving these to somewhere better (selectors? elsewhere?)
export const tokenBalanceIsPositive = ({
  balance,
}: TokenType | TokenRecordType) => balance >= 0;

export const tokenBalanceIsNotPositive = ({
  balance,
}: TokenType | TokenRecordType) => balance <= 0;

export const tokenIsETH = ({ address }: TokenType | TokenRecordType) =>
  address === '0x0';
