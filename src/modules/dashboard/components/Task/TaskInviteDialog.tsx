import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { Address } from '~types/index';
import {
  AnyTask,
  AnyUser,
  Payouts,
  useAssignWorkerMutation,
  useColonyTokensQuery,
} from '~data/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import Assignment from '~core/Assignment';
import Button from '~core/Button';
import { FormStatus, Form } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import Heading from '~core/Heading';
import Payout from '~dashboard/TaskEditDialog/Payout';
import DialogBox from '~core/Dialog/DialogBox';

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
  // This component is unused. These todos need to be fixed when we start using it again
  // @todo get payouts from centralized store
  const payouts = [] as Payouts;

  // @todo get reputation from centralized store (someday)
  const reputation = undefined;

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

  // @TODO revise if the token query is still necessary
  // @BODY This component is currently unused. Depending on from where we are opening it we can probably pass in all the required information via props. Then remove the ZERO_ADDRESS fallback!
  const { data: colonyData } = useColonyTokensQuery({
    variables: { address: colonyAddress },
  });

  const tokens = colonyData && colonyData.colony.tokens;
  const nativeTokenAddress =
    (colonyData && colonyData.colony.nativeTokenAddress) || ZERO_ADDRESS;

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
                {tokens && (
                  <Assignment
                    payouts={payouts}
                    nativeTokenAddress={nativeTokenAddress}
                    tokens={tokens}
                    pending
                    reputation={reputation}
                    showFunding={false}
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
                    {nativeTokenAddress && payouts
                      ? payouts.map((payout, index) => {
                          return (
                            <Payout
                              key={payout.token.address}
                              payout={payout}
                              name={`payouts.${index}`}
                              tokens={tokens}
                              colonyAddress={colonyAddress}
                              reputation={0}
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
