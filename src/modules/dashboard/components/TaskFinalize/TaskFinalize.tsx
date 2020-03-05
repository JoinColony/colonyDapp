import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import moveDecimal from 'move-decimal-point';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import TaskFinalizeDialog from './TaskFinalizeDialog';

import { Address } from '~types/index';
import {
  AnyTask,
  Payouts,
  useTokenBalancesForDomainsQuery,
  useFinalizeTaskMutation,
} from '~data/index';
import { ActionTypes } from '~redux/index';
import { useAsyncFunction } from '~utils/hooks';
import { bnLessThan } from '~utils/numbers';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

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
  ethDomainId: AnyTask['ethDomainId'];
  ethSkillId: AnyTask['ethSkillId'];
  payouts: Payouts;
  workerAddress: AnyTask['assignedWorkerAddress'];
}

const TaskFinalize = ({
  draftId,
  colonyAddress,
  ethDomainId,
  ethSkillId,
  payouts,
  workerAddress,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const openDialog = useDialog(TaskFinalizeDialog);

  const tokenAddresses = payouts.map(({ token }) => token.address);
  const { data: tokenBalances } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress,
      tokenAddresses,
      domainIds: [ethDomainId],
    },
  });
  const [finalizeTaskMutation] = useFinalizeTaskMutation();

  const finalizeTask = useAsyncFunction({
    submit: ActionTypes.TASK_FINALIZE,
    error: ActionTypes.TASK_FINALIZE_ERROR,
    success: ActionTypes.TASK_FINALIZE_SUCCESS,
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
              moveDecimal(
                amount,
                domainBalances.decimals || DEFAULT_TOKEN_DECIMALS,
              ),
            ),
        );
      });
      if (!enoughFundsAvailable) {
        return openDialog()
          .afterClosed()
          .then(() => setIsLoading(false), () => setIsLoading(false));
      }

      const { potId } = (await finalizeTask({
        colonyAddress,
        domainId: ethDomainId,
        draftId,
        payouts,
        skillId: ethSkillId,
        workerAddress,
      })) as {
        draftId: string;
        potId: number;
      };
      await finalizeTaskMutation({
        variables: { input: { id: draftId, ethPotId: potId } },
      });
      return setIsLoading(false);
    } catch (error) {
      console.error(error);
      return setIsLoading(false);
    }
  }, [
    colonyAddress,
    draftId,
    ethDomainId,
    ethSkillId,
    finalizeTask,
    finalizeTaskMutation,
    openDialog,
    payouts,
    tokenBalances,
    workerAddress,
  ]);

  return (
    <Button
      text={MSG.finalizeTask}
      onClick={handleOnClick}
      loading={isLoading}
    />
  );
};

TaskFinalize.displayName = displayName;

export default TaskFinalize;
