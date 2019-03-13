/* @flow */

import type { TokenType, TokenRecordType } from '../Token';

export const tokenBalanceIsPositive = ({
  balance,
}: TokenType | TokenRecordType) => balance >= 0;

export const tokenBalanceIsNotPositive = ({
  balance,
}: TokenType | TokenRecordType) => balance <= 0;

export const tokenIsETH = ({ address }: TokenType | TokenRecordType) =>
  address === '0x0';
