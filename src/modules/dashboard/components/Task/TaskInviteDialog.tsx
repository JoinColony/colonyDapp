import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { AnyUser, useAssignWorkerMutation, AnyTask } from '~data/index';
import Assignment from '~core/Assignment';
import Button from '~core/Button';
import { FormStatus, Form } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import Heading from '~core/Heading';
import Payout from '~dashboard/TaskEditDialog/Payout';
import DialogBox from '~core/Dialog/DialogBox';
import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';
import { useColonyTokens } from '../../hooks/useColonyTokens';
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

interface FormValues {
  payouts: [{ amount: string; token: Address }];
  workerAddress: Address;
}

interface Props {
  colonyAddress: Address;
  draftId: AnyTask['id'];
  currentUser: AnyUser;
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
  // fixme get payouts from centralized store
  const payouts = [];

  // @todo get reputation from centralized store (someday)
  const reputation = undefined;

  const nativeTokenReference = useColonyNativeToken(colonyAddress);
  const [, tokenOptions] = useColonyTokens(colonyAddress);

  const [assignWorker] = useAssignWorkerMutation();

  const onSubmit = useCallback(
    ({ workerAddress }: FormValues) =>
      assignWorker({
        variables: {
          input: {
            id: draftId,
            workerAddress,
          },
        },
      }),
    [assignWorker, draftId],
  );

  return (
    <FullscreenDialog cancel={cancel}>
      <Form
        initialValues={{
          payouts,
          worker: currentUser,
        }}
        onSubmit={onSubmit}
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
                    payouts={payouts}
                    pending
                    reputation={reputation}
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
                    {nativeTokenReference && payouts
                      ? payouts.map((payout, index) => {
                          const { amount, token } = payout;
                          return (
                            <Payout
                              key={token}
                              name={`payouts.${index}`}
                              amount={amount}
                              colonyAddress={colonyAddress}
                              reputation={
                                token === nativeTokenReference.address &&
                                reputation
                                  ? reputation
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
      </Form>
    </FullscreenDialog>
  );
};

export default TaskInviteDialog;
