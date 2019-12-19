import React, { useCallback } from 'react';

// FIXME remove the task payout type entirely
import { TaskPayoutType } from '~immutable/index';
import { Address } from '~types/index';
import { FullColonyFragment } from '~data/index';

import Payout from './Payout';

interface Props {
  arrayHelpers: any;
  canRemove: boolean;
  colonyAddress: Address;
  index: number;
  nativeTokenAddress: Address;
  // fixme use task payout type from server
  payout: TaskPayoutType;
  payouts: TaskPayoutType[];
  reputation: number;
  tokens: FullColonyFragment['tokens'];
}

const WrappedPayout = ({
  arrayHelpers,
  canRemove,
  colonyAddress,
  index,
  nativeTokenAddress,
  payout,
  payouts,
  reputation,
  tokens,
}: Props) => {
  const { amount, token: tokenAddress } = payout;

  const token = tokens.find(({ address }) => address === tokenAddress);

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

  return (
    <Payout
      amount={amount}
      colonyAddress={colonyAddress}
      name={`payouts.${index}`}
      reputation={
        token && token.address === nativeTokenAddress ? reputation : undefined
      }
      token={token}
      tokens={tokens}
      canRemove={canRemove}
      remove={removePayout}
      reset={resetPayout}
    />
  );
};

export default WrappedPayout;
