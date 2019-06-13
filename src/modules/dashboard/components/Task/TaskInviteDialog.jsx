/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import type { Address } from '~types';
import type { UserType } from '~immutable';

import { mergePayload } from '~utils/actions';

import Assignment from '~core/Assignment';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Payout from '~dashboard/TaskEditDialog/Payout';
import DialogBox from '~core/Dialog/DialogBox.jsx';

import { useColonyNativeToken } from '../../hooks/useColonyNativeToken';

import styles from './TaskInviteDialog.css';

import ACTIONS from '~redux/actions';

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

type Props = {|
  colonyAddress: Address,
  draftId: string,
  currentUser: UserType,
  cancel: () => void,
|};

const TaskInviteDialog = ({
  cancel,
  colonyAddress,
  draftId,
  currentUser: {
    profile: { walletAddress },
  },
  currentUser,
}: Props) => {
  // @TODO TaskInviteDialog: Fetch the task using a hook
  // @BODY: We should also remove the locally mocked data below
  //
  // const { data: task } = useDataFetcher<TaskType>(
  //   taskFetcher,
  //   [taskId],
  //   [taskId],
  // );
  const reputation = 0;
  const payouts = [];
  const nativeTokenReference = useColonyNativeToken(colonyAddress);
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
        initialValues={{ payouts: payouts || [], worker: currentUser }}
        submit={ACTIONS.TASK_WORKER_ASSIGN}
        success={ACTIONS.TASK_WORKER_ASSIGN_SUCCESS}
        error={ACTIONS.TASK_WORKER_ASSIGN_ERROR}
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
                <Assignment
                  nativeToken={nativeTokenReference}
                  payouts={payouts}
                  pending
                  reputation={reputation}
                  showFunding={false}
                  worker={currentUser}
                  workerAddress={walletAddress}
                />
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
                    {payouts &&
                      payouts.map((payout, index) => {
                        const { amount, token } = payout;
                        return (
                          <Payout
                            key={token.address}
                            name={`payouts.${index}`}
                            amount={amount}
                            decimals={token.decimals}
                            symbol={token.symbol}
                            reputation={
                              // $FlowFixMe this should be from TokenReference
                              token.address === nativeTokenReference.address
                                ? reputation
                                : undefined
                            }
                            editPayout={false}
                          />
                        );
                      })}
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
