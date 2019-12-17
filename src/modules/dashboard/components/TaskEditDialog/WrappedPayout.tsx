import React, { useCallback } from 'react';

import { TaskPayoutType, ColonyTokenReferenceType } from '~immutable/index';
import { Address } from '~types/index';
import Payout from './Payout';

interface Props {
  arrayHelpers: any;
  canRemove: boolean;
  colonyAddress: Address;
  index: number;
  payout: TaskPayoutType;
  payouts: TaskPayoutType[];
  reputation: number;
  tokenOptions: { value: number; label: string }[];
  tokenReferences: ColonyTokenReferenceType[];
}

const WrappedPayout = ({
  arrayHelpers,
  canRemove,
  colonyAddress,
  index,
  payout,
  payouts,
  reputation,
  tokenOptions,
  tokenReferences,
}: Props) => {
  const { amount, token: tokenAddress } = payout;

  const tokenReference = tokenReferences.find(
    ({ address }) => address === tokenAddress,
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

  return (
    <Payout
      amount={amount}
      colonyAddress={colonyAddress}
      name={`payouts.${index}`}
      reputation={tokenReference.isNative ? reputation : undefined}
      tokenOptions={tokenOptions}
      canRemove={canRemove}
      remove={removePayout}
      reset={resetPayout}
      tokenAddress={tokenAddress}
    />
  );
};

export default WrappedPayout;
