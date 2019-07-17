/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback } from 'react';

import type { TaskPayoutType, TaskType, TokenReferenceType } from '~immutable';
import type { Address, $Pick } from '~types';

import Payout from './Payout';

type Props = {|
  ...$Exact<$Pick<TaskType, {| payouts: *, reputation: * |}>>,
  arrayHelpers: *,
  canRemove: boolean,
  colonyAddress: Address,
  index: number,
  payout: TaskPayoutType,
  reputation: number,
  tokenOptions: Array<{ value: number, label: string }>,
  tokenReferences: Array<TokenReferenceType>,
  wasTouched: boolean,
|};

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
  wasTouched,
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
      /*
       * @NOTE Of course it's a hack :(
       *
       * Needed in order to format decimal values inside the input
       * This is because Cleave isn't of much use in thiscase
       */
      wasTouched={wasTouched}
    />
  );
};

export default WrappedPayout;
