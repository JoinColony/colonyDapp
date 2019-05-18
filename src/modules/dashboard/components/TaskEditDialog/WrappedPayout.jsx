/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback, useMemo } from 'react';

import type { TaskType, TokenReferenceType, TokenType } from '~immutable';
import type { $Pick } from '~types';

import { addressEquals } from '~utils/strings';

import { tokenIsETH } from '../../checks';

import Payout from './Payout';

type Props = {|
  ...$Exact<$Pick<TaskType, {| payouts: *, reputation: * |}>>,
  availableTokens: Array<TokenType>,
  canRemove: boolean,
  index: number,
  arrayHelpers: *,
  payout: { amount: string, token: string },
  reputation: number,
  tokenOptions: Array<{ value: number, label: string }>,
  tokenReferences: Array<TokenReferenceType>,
|};

const WrappedPayout = ({
  arrayHelpers,
  availableTokens,
  canRemove,
  index,
  payout,
  payouts,
  reputation,
  tokenOptions,
  tokenReferences,
}: Props) => {
  const { amount, token: tokenAddress } = payout;

  const token = availableTokens.find(({ address }) =>
    addressEquals(address, tokenAddress),
  ) || { address: '', decimals: 18, name: '', symbol: '' }; // make flow happy for below

  const tokenReference = tokenReferences.find(({ address }) =>
    addressEquals(address, tokenAddress),
  ) || { address: '' }; // make flow happy for below

  const removePayout = useCallback(() => arrayHelpers.remove(index), [
    arrayHelpers,
    index,
  ]);

  const resetPayout = useCallback(
    () =>
      payouts.length > 0
        ? arrayHelpers.replace(index, payouts[index])
        : arrayHelpers.remove(index),
    [arrayHelpers, index, payouts],
  );

  const isEth = useMemo(() => tokenIsETH(token), [token]);

  return (
    <Payout
      name={`payouts.${index}`}
      amount={amount}
      decimals={token.decimals}
      symbol={token.symbol}
      reputation={tokenReference.isNative ? reputation : undefined}
      isEth={isEth}
      tokenOptions={tokenOptions}
      canRemove={canRemove}
      remove={removePayout}
      reset={resetPayout}
    />
  );
};

export default WrappedPayout;
