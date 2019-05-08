/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback, useMemo } from 'react';

import type { TaskType, TokenType } from '~immutable';
import type { $Pick } from '~types';

import { tokenIsETH } from '../../checks';

import Payout from './Payout.jsx';

type Props = {|
  ...$Exact<$Pick<TaskType, {| payouts: *, reputation: * |}>>,
  availableTokens: Array<TokenType>,
  tokenOptions: Array<{ value: number, label: string }>,
  payout: { amount: string, token: number },
  arrayHelpers: *,
  reputation: number,
  index: number,
  canRemove: boolean,
|};

const WrappedPayout = ({
  availableTokens,
  tokenOptions,
  payout,
  payouts,
  arrayHelpers,
  reputation,
  index,
  canRemove,
}: Props) => {
  const { amount, token: tokenIndex } = payout;
  const token = availableTokens[tokenIndex - 1] || {};

  const removePayout = useCallback(() => arrayHelpers.remove(index), [
    arrayHelpers,
    index,
  ]);

  const resetPayout = useCallback(
    () => arrayHelpers.replace(index, payouts[index]),
    [arrayHelpers, index, payouts],
  );

  const isEth = useMemo(() => tokenIsETH(token), [token]);

  return (
    <Payout
      name={`payouts.${index}`}
      amount={amount}
      decimals={!!token.decimals && token.decimals >= 0 ? token.decimals : 18}
      symbol={token.symbol}
      // $FlowFixMe this should be from TokenReference
      reputation={token.isNative ? reputation : undefined}
      isEth={isEth}
      tokenOptions={tokenOptions}
      canRemove={canRemove}
      remove={removePayout}
      reset={resetPayout}
    />
  );
};

export default WrappedPayout;
