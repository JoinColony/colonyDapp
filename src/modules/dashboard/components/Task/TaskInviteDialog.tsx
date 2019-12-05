import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { TaskPayoutType } from '~immutable/index';
import { User } from '~data/index';
import { mergePayload } from '~utils/actions';
import Assignment from '~core/Assignment';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import Heading from '~core/Heading';
import Payout from '~dashboard/TaskEditDialog/Payout';
import DialogBox from '~core/Dialog/DialogBox';
import { taskSubscriber } from '../../subscribers';
import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { useColonyTokens } from '../../hooks/useColonyTokens';
import { useDataSubscriber } from '~utils/hooks';
import { ActionTypes } from '~redux/index';
import styles from './TaskInviteDialog.css';

const MSG = defineMessages({
  titleAssignment: {
    id: 'dashboard.Task.taskInviteDialog.titleAssignment',
    defaultMessage: 'Assignment',
  },
  titleFunding: {
    id: 'dashboard.Task.taskInviteDialog.titleFunding',
    defaultMessage: 'Funding',
  },
});

interface Props {
  colonyAddress: Address;
  draftId: string;
  currentUser: User;
  cancel: () => void;
  close: () => void;
}

const TaskInviteDialog = ({
  cancel,
  colonyAddress,
  draftId,
  currentUser: {
    profile: { walletAddress },
  },
  currentUser,
}: Props) => {
  const { data: taskData } = useDataSubscriber(
    taskSubscriber,
    [draftId],
    [colonyAddress || undefined, draftId],
  );

  const nativeTokenReference = useColonyNativeToken(colonyAddress);
  const [, tokenOptions] = useColonyTokens(colonyAddress);
  const transform = useCallback(
    mergePayload({
      worker: walletAddress,
      draftId,
      colonyAddress,
    }),
    [walletAddress, draftId, colonyAddress],
  );
  return (
    <FullscreenDialog cancel={cancel}>
      <ActionForm
        initialValues={{
          payouts: (taskData && taskData.payouts) || [],
          worker: currentUser,
        }}
        submit={ActionTypes.TASK_WORKER_ASSIGN}
        success={ActionTypes.TASK_WORKER_ASSIGN_SUCCESS}
        error={ActionTypes.TASK_WORKER_ASSIGN_ERROR}
        transform={transform}
      >
        {({ status, isSubmitting }) => (
          <>
            <FormStatus status={status} />
            <DialogBox>
              <DialogSection appearance={{ border: 'bottom' }}>
                <Heading
                  appearance={{ size: 'medium' }}
                  text={MSG.titleAssignment}
                />
                {tokenOptions && (
                  <Assignment
                    nativeToken={nativeTokenReference}
                    payouts={
                      ((taskData && taskData.payouts) || []) as TaskPayoutType[]
                    }
                    pending
                    reputation={
                      taskData && taskData.reputation
                        ? taskData.reputation
                        : undefined
                    }
                    showFunding={false}
                    tokenOptions={tokenOptions}
                    worker={currentUser}
                    workerAddress={walletAddress}
                  />
                )}
              </DialogSection>
              <DialogSection>
                <div className={styles.taskEditContainer}>
                  <div className={styles.editor}>
                    <Heading
                      appearance={{ size: 'medium' }}
                      text={MSG.titleFunding}
                    />
                  </div>
                  <div>
                    {nativeTokenReference && taskData && taskData.payouts
                      ? taskData.payouts.map((payout, index) => {
                          const { amount, token } = payout;
                          return (
                            <Payout
                              key={token}
                              name={`payouts.${index}`}
                              amount={amount}
                              colonyAddress={colonyAddress}
                              reputation={
                                token === nativeTokenReference.address &&
                                taskData
                                  ? taskData.reputation
                                  : undefined
                              }
                              tokenAddress={token}
                              editPayout={false}
                            />
                          );
                        })
                      : null}
                  </div>
                </div>
              </DialogSection>
            </DialogBox>
            <div className={styles.buttonContainer}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                onClick={cancel}
                text={{ id: 'button.decline' }}
                disabled={isSubmitting}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                text={{ id: 'button.accept' }}
                type="submit"
                loading={isSubmitting}
              />
            </div>
          </>
        )}
      </ActionForm>
    </FullscreenDialog>
  );
};

export default TaskInviteDialog;
