/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import { compose } from 'recompose';

import type { UserType, TaskType, ColonyType, DataType } from '~immutable';

import { withTask, withColony } from '../../hocs';
import { withCurrentUser } from '../../../users/hocs';

import { withImmutablePropsToJS } from '~utils/hoc';

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

type Props = {
  task: TaskType,
  currentUser: UserType,
  colony?: DataType<ColonyType>,
  cancel: () => void,
};

class TaskInviteDialog extends Component<Props> {
  static displayName = 'dashboard.task.taskInviteDialog';

  setPayload = (action: Object) => {
    const {
      task: { taskId },
      currentUser,
      /* This shouldn't throw an error since address is
      indeed a property of shared */
      // $FlowFixMe
      colony: { address },
    } = this.props;
    return {
      ...action,
      payload: {
        user: currentUser,
        taskId,
        colonyAddress: address,
      },
    };
  };

  mounted = false;

  render() {
    const {
      cancel,
      task: { reputation, payouts },
      currentUser,
    } = this.props;
    return (
      <FullscreenDialog cancel={cancel}>
        <ActionForm
          initialValues={{ payouts: payouts || [], assignee: currentUser }}
          submit={ACTIONS.TASK_ASSIGN}
          success={ACTIONS.TASK_ASSIGN_SUCCESS}
          error={ACTIONS.TASK_ASSIGN_ERROR}
          setPayLoad={this.setPayload}
        >
          {({ status, isSubmitting }) => (
            <Fragment>
              <FormStatus status={status} />
              <DialogBox>
                <DialogSection appearance={{ border: 'bottom' }}>
                  <Heading
                    appearance={{ size: 'medium' }}
                    text={MSG.titleAssignment}
                  />
                  <Assignment
                    assignee={currentUser}
                    reputation={reputation}
                    payouts={payouts}
                    nativeToken="CLNY"
                    showFunding={false}
                    pending
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
                              key={token.symbol}
                              name={`payouts.${index}`}
                              amount={amount}
                              symbol={token.symbol}
                              reputation={
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
            </Fragment>
          )}
        </ActionForm>
      </FullscreenDialog>
    );
  }
}

export default compose(
  withColony,
  withTask,
  withCurrentUser,
  withImmutablePropsToJS,
)(TaskInviteDialog);
