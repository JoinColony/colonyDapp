import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { Form } from '~core/Fields';
import { useDomainFundsCheck } from '~dashboard/TaskFinalizeDialog';
import { Address } from '~types/index';
import { AnyTask, Payouts, useFinalizeTaskMutation } from '~data/index';
import { ActionTypes } from '~redux/index';
import { useAsyncFunction } from '~utils/hooks';

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
  const [finalizeTaskMutation] = useFinalizeTaskMutation();

  const finalizeTask = useAsyncFunction({
    submit: ActionTypes.TASK_FINALIZE,
    error: ActionTypes.TASK_FINALIZE_ERROR,
    success: ActionTypes.TASK_FINALIZE_SUCCESS,
  });

  const checkDomainFunds = useDomainFundsCheck(
    colonyAddress,
    payouts,
    ethDomainId,
  );

  const handleSubmit = useCallback(async () => {
    if (await checkDomainFunds()) {
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
    }
  }, [
    checkDomainFunds,
    colonyAddress,
    draftId,
    ethDomainId,
    ethSkillId,
    finalizeTask,
    finalizeTaskMutation,
    payouts,
    workerAddress,
  ]);

  return (
    <Form onSubmit={handleSubmit} initialValues={{}}>
      {({ isSubmitting }) => (
        <Button text={MSG.finalizeTask} loading={isSubmitting} type="submit" />
      )}
    </Form>
  );
};

TaskFinalize.displayName = displayName;

export default TaskFinalize;
