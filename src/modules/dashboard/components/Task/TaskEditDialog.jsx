/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import BigNumber from 'bn.js';
import * as yup from 'yup';
import nanoid from 'nanoid';

import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FieldArray } from 'formik';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Payout from './Payout.jsx';
import DialogBox from '~core/Dialog/DialogBox.jsx';
import { getEthToUsd } from '~utils/external';
import { bnMultiply } from '~utils/numbers';

import type { UserRecord, TokenType } from '~types/';

import styles from './TaskEditDialog.css';

const MSG = defineMessages({
  titleAssignment: {
    id: 'dashboard.Task.taskEditDialog.titleAssignment',
    defaultMessage: 'Assignment',
  },
  titleFunding: {
    id: 'dashboard.Task.taskEditDialog.titleFunding',
    defaultMessage: 'Funding',
  },
  add: {
    id: 'dashboard.Task.taskEditDialog.add',
    defaultMessage: 'Add +',
  },
  notSet: {
    id: 'dashboard.Task.taskEditDialog.notSet',
    defaultMessage: 'Not set',
  },
  search: {
    id: 'dashboard.Task.taskEditDialog.search',
    defaultMessage: 'Search...',
  },
  selectAssignee: {
    id: 'dashboard.Task.taskEditDialog.selectAssignee',
    defaultMessage: 'Select Assignee',
  },
  insufficientFundsError: {
    id: 'dashboard.Task.taskEditDialog.insufficientFundsError',
    defaultMessage: "You don't have enough funds",
  },
  tokenRequiredError: {
    id: 'dashboard.Task.taskEditDialog.tokenRequiredError',
    defaultMessage: 'Token required',
  },
  amountRequiredError: {
    id: 'dashboard.Task.taskEditDialog.amountRequiredError',
    defaultMessage: 'Amount required',
  },
});

type State = {
  ethUsdConversion?: BigNumber,
};

type Props = {
  assignee?: UserRecord,
  availableTokens: Array<TokenType>,
  maxTokens?: BigNumber,
  payouts?: Array<Object>,
  reputation?: BigNumber,
  users: Array<UserRecord>,
  cancel: () => void,
};

const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

class TaskEditDialog extends Component<Props, State> {
  static displayName = 'dashboard.task.taskEditDialog';

  state = {};

  componentDidMount() {
    getEthToUsd(1).then(rate =>
      this.setState({
        ethUsdConversion: new BigNumber(rate),
      }),
    );
  }

  addTokenFunding = (values: { payouts?: Array<any> }, helpers: () => void) => {
    const { maxTokens } = this.props;
    if (canAddTokens(values, maxTokens))
      helpers.push({
        id: nanoid(),
      });
  };

  setPayload = (action: Object, { assignee, payouts }: Object) => {
    const { availableTokens } = this.props;
    return {
      ...action,
      payload: {
        assignee,
        payouts: payouts.map(({ token, amount }) => ({
          amount,
          token: availableTokens[token - 1],
        })),
      },
    };
  };

  render() {
    const {
      cancel,
      reputation,
      payouts,
      assignee,
      maxTokens,
      availableTokens,
      users,
    } = this.props;
    const { ethUsdConversion } = this.state;
    const validateFunding = yup.object().shape({
      payouts: yup
        .array()
        .of(
          yup.object().shape({
            token: yup.string().required(MSG.tokenRequiredError),
            amount: yup
              .string()
              .required(MSG.amountRequiredError)
              .lessThanPot(availableTokens, MSG.insufficientFundsError),
          }),
        )
        .max(maxTokens), // only ETH and CLNY for MVP
    });
    const tokenOptions = availableTokens.map(({ tokenSymbol }, i) => ({
      value: i + 1,
      label: tokenSymbol,
    }));

    return (
      <FullscreenDialog cancel={cancel}>
        <ActionForm
          submit="CREATE_COOL_THING"
          success="COOL_THING_CREATED"
          error="COOL_THING_CREATE_ERROR"
          initialValues={{ payouts: payouts || [], assignee }}
          validationSchema={validateFunding}
          setPayload={this.setPayload}
        >
          {({ status, values, dirty, isSubmitting, errors }) => (
            <Fragment>
              <FormStatus status={status} />
              <DialogBox>
                <DialogSection appearance={{ border: 'bottom' }}>
                  <Heading
                    appearance={{ size: 'medium' }}
                    text={MSG.titleAssignment}
                  />
                  <SingleUserPicker
                    name="assignee"
                    isResettable
                    itemComponent={ItemDefault}
                    label={MSG.selectAssignee}
                    data={users}
                    filter={filter}
                    placeholder={MSG.search}
                  />
                </DialogSection>
                <DialogSection>
                  <FieldArray
                    name="payouts"
                    render={arrayHelpers => (
                      <div className={styles.taskEditContainer}>
                        <div className={styles.editor}>
                          <Heading
                            appearance={{ size: 'medium' }}
                            text={MSG.titleFunding}
                          />
                          {canAddTokens(values, maxTokens) && (
                            <Button
                              appearance={{ theme: 'blue', size: 'small' }}
                              text={MSG.add}
                              onClick={() =>
                                this.addTokenFunding(values, arrayHelpers)
                              }
                            />
                          )}
                        </div>
                        {values.payouts &&
                          values.payouts.map((payout, index) => {
                            const { amount, token: tokenIndex } = payout;
                            const token = availableTokens[tokenIndex - 1] || {};
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
                                tokenOptions={tokenOptions}
                                remove={() => arrayHelpers.remove(index)}
                              />
                            );
                          })}
                      </div>
                    )}
                  />
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

export default TaskEditDialog;
