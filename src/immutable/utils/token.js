/* @flow */

import type { TokenType, TokenRecordType } from '../Token';

import { ZERO_ADDRESS } from '~utils/web3/constants';

// TODO consider moving these to somewhere better (selectors? elsewhere?)
export const tokenBalanceIsPositive = ({
  balance,
}: TokenType | TokenRecordType) => !!balance && balance.gten(0);

export const tokenBalanceIsNotPositive = ({
  balance,
}: TokenType | TokenRecordType) => !!balance && balance.lten(0);

export const tokenIsETH = ({ address }: TokenType | TokenRecordType) =>
  address === ZERO_ADDRESS;
