/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { UserType, TaskType } from '~immutable';

import { mergePayload } from '~utils/actions';

import Assignment from '~core/Assignment';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Payout from '~dashboard/TaskEditDialog/Payout.jsx';
import DialogBox from '~core/Dialog/DialogBox.jsx';

import styles from './TaskInviteDialog.css';

import tokensMock from '../../../../__mocks__/mockTokens';

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
  task: TaskType,
  currentUser: UserType,
  cancel: () => void,
|};

const TaskInviteDialog = ({
  cancel,
  task: { reputation, payouts, draftId, colonyENSName },
  currentUser: {
    profile: { walletAddress },
  },
  currentUser,
}: Props) => (
  <FullscreenDialog cancel={cancel}>
    <ActionForm
      initialValues={{ payouts: payouts || [], worker: currentUser }}
      submit={ACTIONS.TASK_WORKER_ASSIGN}
      success={ACTIONS.TASK_WORKER_ASSIGN_SUCCESS}
      error={ACTIONS.TASK_WORKER_ASSIGN_ERROR}
      transform={mergePayload({
        worker: walletAddress,
        draftId,
        colonyENSName,
      })()}
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
              {/* TODO supply nativeToken with a selector */}
              <Assignment
                nativeToken={{ address: '' }}
                payouts={payouts}
                pending
                reputation={reputation}
                showFunding={false}
                worker={currentUser}
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
                      const { amount } = payout;
                      const token = tokensMock.get(index - 1) || {};
                      return (
                        <Payout
                          key={token.address}
                          name={`payouts.${index}`}
                          amount={amount}
                          symbol={token.symbol}
                          reputation={
                            // $FlowFixMe this should be from TokenReference
                            token.isNative ? reputation : undefined
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

export default TaskInviteDialog;
