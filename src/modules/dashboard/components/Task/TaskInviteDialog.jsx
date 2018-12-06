/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import BigNumber from 'bn.js';

import Assignment from '~core/Assignment';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Payout from './Payout.jsx';
import DialogBox from '~core/Dialog/DialogBox.jsx';
import { getEthToUsd } from '~utils/external';
import { bnMultiply } from '~utils/numbers';

import type { UserRecord } from '~types/';

import styles from './TaskInviteDialog.css';

import tokensMock from '../Wallet/__datamocks__/mockTokens';

const MSG = defineMessages({
  titleAssignment: {
    id: 'dashboard.Task.taskInviteDialog.titleAssignment',
    defaultMessage: 'Assignment',
  },
  titleFunding: {
    id: 'dashboard.Task.taskInviteDialog.titleFunding',
    defaultMessage: 'Funding',
  },
  add: {
    id: 'dashboard.Task.taskInviteDialog.add',
    defaultMessage: 'Add +',
  },
  notSet: {
    id: 'dashboard.Task.taskInviteDialog.notSet',
    defaultMessage: 'Not set',
  },
  search: {
    id: 'dashboard.Task.taskInviteDialog.search',
    defaultMessage: 'Search...',
  },
  selectAssignee: {
    id: 'dashboard.Task.taskInviteDialog.selectAssignee',
    defaultMessage: 'Select Assignee',
  },
  insufficientFundsError: {
    id: 'dashboard.Task.taskInviteDialog.insufficientFundsError',
    defaultMessage: "You don't have enough funds",
  },
  tokenRequiredError: {
    id: 'dashboard.Task.taskInviteDialog.tokenRequiredError',
    defaultMessage: 'Token required',
  },
  amountRequiredError: {
    id: 'dashboard.Task.taskInviteDialog.amountRequiredError',
    defaultMessage: 'Amount required',
  },
});

type State = {
  ethUsdConversion?: BigNumber,
};

type Props = {
  assignee?: UserRecord,
  payouts?: Array<Object>,
  reputation?: BigNumber,
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

  mounted = false;

  render() {
    const { cancel, reputation, payouts, assignee } = this.props;
    const { ethUsdConversion } = this.state;
    return (
      <FullscreenDialog cancel={cancel}>
        <ActionForm
          submit="TASK_ACCEPT_INVITE"
          success="TASK_ACCEPT_INVITE_SUCCESS"
          error="TASK_ACCEPT_INVITE_ERROR"
          initialValues={{ assignee }}
        >
          {({ status, dirty, isSubmitting, errors }) => (
            <Fragment>
              <FormStatus status={status} />
              <DialogBox>
                <DialogSection appearance={{ border: 'bottom' }}>
                  <Heading
                    appearance={{ size: 'medium' }}
                    text={MSG.titleAssignment}
                  />
                  <Assignment assignee={assignee} pending />
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
                          const { amount, token: tokenIndex } = payout;
                          const token = tokensMock[tokenIndex - 1] || {};
                          return (
                            <Payout
                              key={payout.id}
                              name={`payouts.${index}`}
                              amount={amount}
                              symbol={token.tokenSymbol}
                              reputation={
                                token.isNative ? reputation : undefined
                              }
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
                  text={{ id: 'button.cancel' }}
                  disabled={isSubmitting}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  text={{ id: 'button.confirm' }}
                  type="submit"
                  disabled={!dirty || !!Object.keys(errors).length}
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

export default TaskInviteDialog;
