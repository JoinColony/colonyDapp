import React, { FC, useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import moveDecimal from 'move-decimal-point';

import Button from '~core/Button';
import { withDialog } from '~core/Dialog';

import { Address } from '~types/index';
import { OpenDialog } from '~core/Dialog/types';
import {
  AnyTask,
  Payouts,
  Domain,
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

interface InProps {
  draftId: AnyTask['id'];
  colonyAddress: Address;
  ethDomainId: Domain['ethDomainId'];
  payouts: Payouts;
}

interface Props extends InProps {
  // Injected via `withDialog`
  openDialog: OpenDialog;
}

const TaskFinalize = ({
  draftId,
  colonyAddress,
  ethDomainId,
  payouts,
  openDialog,
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

  const handleOnClick = useCallback(async () => {
    try {
      setIsLoading(true);
      const enoughFundsAvailable = payouts.every(({ amount, tokenAddress }) => {
        const domainBalances =
          tokenBalances &&
          tokenBalances.tokens.find(
            ({ address: domainTokenAddress }) =>
              domainTokenAddress === tokenAddress,
          );
        if (!domainBalances) {
          return false;
        }
        return domainBalances.balances.every(
          ({ amount: availableDomainAmount }) =>
            !bnLessThan(
              availableDomainAmount,
              moveDecimal(amount, domainBalances.decimals || 18),
            ),
        );
      });
      if (!enoughFundsAvailable) {
        return openDialog('TaskFinalizeDialog')
          .afterClosed()
          .then(() => setIsLoading(false), () => setIsLoading(false));
      }
      await finalizeTask({});
      return setIsLoading(false);
    } catch (error) {
      return setIsLoading(false);
    }
  }, [finalizeTask, openDialog, payouts, tokenBalances]);

  return (
    <Button
      text={MSG.finalizeTask}
      onClick={handleOnClick}
      loading={isLoading}
    />
  );
};

TaskFinalize.displayName = displayName;

export default (withDialog() as any)(TaskFinalize) as FC<InProps>;
