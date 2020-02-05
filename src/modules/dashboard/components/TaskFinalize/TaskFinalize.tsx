import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import moveDecimal from 'move-decimal-point';

import Button from '~core/Button';

import { Address } from '~types/index';
import {
  AnyTask,
  Payouts,
  TokenWithBalances,
  useTokenBalancesForDomainsQuery,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { useAsyncFunction } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { bnLessThan } from '~utils/numbers';

const MSG = defineMessages({
  finalizeTask: {
    id: 'dashboard.Task.finalizeTask',
    defaultMessage: 'Finalize task',
  },
});

const displayName = 'dashboard.TaskFinalize';

interface Props {
  draftId: AnyTask['id'];
  colonyAddress: Address;
  ethDomainId: number,
  payouts: Payouts,
}

const TaskFinalize = ({
  draftId,
  colonyAddress,
  ethDomainId,
  payouts,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const tokenAddresses = payouts.map(({ token }) => token.address);
  const { data: tokenBalances } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress,
      tokenAddresses,
      domainIds: [ethDomainId],
    },
  });
  const enoughFundsAvailable = payouts.every(({ amount, tokenAddress }) => {
    if (!tokenBalances) {
      return false;
    }
    /*
     * @NOTE About the types ignore
     *
     * For some reason I get a TS error about balances prop not existing, even though
     * it's available on the union type. I must be missing something...
     */
    // @ts-ignore
    const { balances: domainBalances, decimals } = tokenBalances.tokens.find(
      ({ address: domainTokenAddress }) => domainTokenAddress === tokenAddress,
    ) as TokenWithBalances;
    return domainBalances.every(
      ({ amount: availableDomainAmount }) =>
        !bnLessThan(availableDomainAmount, moveDecimal(amount, decimals || 18)),
    );
  });

  const transform = useCallback(
    mergePayload({
      colonyAddress,
      draftId,
    }),
    [colonyAddress, draftId],
  );
  const finalizeTask = useAsyncFunction({
    submit: ActionTypes.TASK_FINALIZE,
    error: ActionTypes.TASK_FINALIZE_ERROR,
    success: ActionTypes.TASK_FINALIZE_SUCCESS,
    transform,
  });

  const handleOnClick = async () => {
    setIsLoading(true);
    try {
      await finalizeTask({});
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Button
      text={MSG.finalizeTask}
      onClick={handleOnClick}
      loading={isLoading}
      disabled={!enoughFundsAvailable}
    />
  );
};

TaskFinalize.displayName = displayName;

export default TaskFinalize;
