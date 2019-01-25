/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import BigNumber from 'bn.js';
import { compose } from 'recompose';

import { withTask } from '../../../core/hocs';

import Assignment from '~core/Assignment';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Payout from '~dashboard/TaskEditDialog/Payout.jsx';
import DialogBox from '~core/Dialog/DialogBox.jsx';
import { getEthToUsd } from '~utils/external';
import { bnMultiply } from '~utils/numbers';

import type { TaskRecord } from '~immutable';
import type { MultisigOperationJSON } from '../../../core/types';

import styles from './TaskInviteDialog.css';

import tokensMock from '../../../../__mocks__/mockTokens';

import {
  TASK_WORKER_ASSIGN,
  TASK_WORKER_ASSIGN_SUCCESS,
  TASK_WORKER_ASSIGN_ERROR,
} from '../../actionTypes';

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

type State = {
  ethUsdConversion?: BigNumber,
};

type Props = {
  multisigJSON: MultisigOperationJSON,
  task: TaskRecord,
  cancel: () => void,
};

class TaskInviteDialog extends Component<Props, State> {
  static displayName = 'dashboard.task.taskInviteDialog';

  state = {};

  componentDidMount() {
    this.mounted = true;

    getEthToUsd(1).then(rate => {
      if (this.mounted) {
        this.setState({ ethUsdConversion: new BigNumber(rate) });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setPayload = (action: Object, { assignee }: Object) => {
    const { task, multisigJSON } = this.props;
    return {
      ...action,
      payload: {
        user: assignee.profile.walletAddress,
        taskId: task.id,
        multisigJSON,
      },
    };
  };

  mounted = false;

  render() {
    const {
      cancel,
      task: { reputation, payouts, assignee },
    } = this.props;
    const { ethUsdConversion } = this.state;
    return (
      <FullscreenDialog cancel={cancel}>
        <ActionForm
          initialValues={{ payouts: payouts || [], assignee }}
          submit={TASK_WORKER_ASSIGN}
          success={TASK_WORKER_ASSIGN_SUCCESS}
          error={TASK_WORKER_ASSIGN_ERROR}
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
                    assignee={assignee}
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
                              usdAmount={
                                token.isEth && ethUsdConversion
                                  ? bnMultiply(ethUsdConversion, amount)
                                  : undefined
                              }
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

export default compose(withTask)(TaskInviteDialog);
