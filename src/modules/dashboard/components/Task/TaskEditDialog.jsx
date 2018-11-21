/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FieldArray } from 'formik';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Payout from './Payout.jsx';
import DialogBox from '~core/Dialog/DialogBox.jsx';

import type { UserRecord } from '~types/';

import styles from './TaskEditDialog.css';

const MSG = defineMessages({
  titleAssignment: {
    id: 'dashboard.task.taskEditDialog.titleAssignment',
    defaultMessage: 'Assignment',
  },
  titleFunding: {
    id: 'dashboard.task.taskEditDialog.titleFunding',
    defaultMessage: 'Funding',
  },
  add: {
    id: 'dashboard.task.taskEditDialog.add',
    defaultMessage: 'Add +',
  },
  notSet: {
    id: 'dashboard.task.taskEditDialog.notSet',
    defaultMessage: 'Not set',
  },
  search: {
    id: 'dashboard.task.taskEditDialog.search',
    defaultMessage: 'Search...',
  },
  selectAssignee: {
    id: 'dashboard.task.taskEditDialog.selectAssignee',
    defaultMessage: 'Select Assignee',
  },
});

type State = {
  touched: boolean,
};

type Token = {
  symbol: string,
  isEth?: boolean,
  isNative?: boolean,
};

type Props = {
  assignee?: UserRecord,
  availableTokens: Array<Token>,
  maxTokens?: number,
  payouts?: Array<Object>,
  reputation?: number,
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

  addTokenFunding = (values: { payouts?: Array<any> }, helpers: () => void) => {
    const { maxTokens } = this.props;
    if (canAddTokens(values, maxTokens)) helpers.push({});
  };

  setPayload = (action: Object, { assignee, payouts }: Object) => {
    const { availableTokens } = this.props;
    return {
      ...action,
      payload: {
        assignee,
        payouts: payouts.map(({ token, amount }) => ({
          amount,
          token: availableTokens[Number(token)],
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
    const validateFunding = yup.object().shape({
      payouts: yup
        .array()
        .of(
          yup.object().shape({
            token: yup.string().required(),
            amount: yup.string().required(),
          }),
        )
        .max(2), // only ETH and CLNY for MVP
    });
    const tokenOptions = availableTokens.map(({ symbol }, i) => ({
      value: `${i}`,
      label: symbol,
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
          {({ status, values, dirty, isSubmitting }) => (
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
                            const token =
                              availableTokens[Number(tokenIndex)] || {};
                            return (
                              <Payout
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                name={`payouts.${index}`}
                                amount={amount}
                                symbol={token.symbol}
                                reputation={reputation || 0}
                                isNative={token.isNative}
                                isEth={token.isEth}
                                tokenOptions={tokenOptions}
                              />
                            );
                          })}
                      </div>
                    )}
                  />
                  {JSON.stringify(values)}
                </DialogSection>
              </DialogBox>
              <div className={styles.buttonContainer}>
                <Button
                  appearance={{ theme: 'secondary', size: 'large' }}
                  onClick={cancel}
                  text={{ id: 'button.cancel' }}
                />
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  text={{ id: 'button.confirm' }}
                  type="submit"
                  disabled={!dirty || isSubmitting}
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
