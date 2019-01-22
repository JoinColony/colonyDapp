/* @flow */
import React, { Fragment } from 'react';
import { List } from 'immutable';
import { defineMessages } from 'react-intl';
import BigNumber from 'bn.js';
import * as yup from 'yup';
import { FieldArray } from 'formik';

import type { DialogType } from '~core/Dialog/types';
import type { TaskRecord, TokenRecord, UserRecord } from '~immutable';

import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import DialogBox from '~core/Dialog/DialogBox.jsx';
import { Token } from '~immutable';

import {
  TASK_ASSIGN_WORKER,
  TASK_ASSIGN_WORKER_ERROR,
  TASK_ASSIGN_WORKER_SUCCESS,
} from '../../actionTypes';

import Payout from './Payout.jsx';

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

export type Props = {
  availableTokens: List<TokenRecord>,
  maxTokens?: BigNumber,
  // @TODO: use `TaskPayoutRecord` for `payouts`
  payouts?: List<{
    token: number,
    amount: BigNumber,
    id: string,
  }>,
  reputation?: BigNumber,
  users: List<UserRecord>,
  task: TaskRecord,
};

type InProps = Props &
  DialogType & {
    addTokenFunding: (
      values: { payouts?: Array<any> },
      helpers: () => void,
    ) => void,
    setPayload: (action: Object, payload: Object) => Object,
  };

const filter = (data: List<UserRecord>, filterValue) =>
  data.filter(
    user =>
      user.profile.username &&
      user.profile.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

const displayName = 'dashboard.TaskEditDialog';

const TaskEditDialog = ({
  addTokenFunding,
  availableTokens,
  cancel,
  maxTokens,
  payouts,
  reputation,
  setPayload,
  task: { assignee },
  users,
}: InProps) => {
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
      .max(maxTokens),
  });
  const tokenOptions = availableTokens
    .map(({ symbol }, i) => ({
      value: i + 1,
      label: symbol,
    }))
    .toArray();

  return (
    <FullscreenDialog
      cancel={cancel}
      /*
       * Setting `isDismissable` to `false` because we don't want a user to be able to
       * close this Dialog after they've submitted the form (while it's processing the data).
       *
       * We can't wrap the Dialog within the form (to use `isSubmitting`), because `react-modal`
       * uses Portals, thus the form wouldn't be able to be submitted.
       */
      isDismissable={false}
    >
      <ActionForm
        submit={TASK_ASSIGN_WORKER}
        success={TASK_ASSIGN_WORKER_SUCCESS}
        error={TASK_ASSIGN_WORKER_ERROR}
        initialValues={{
          payouts:
            payouts && List.isList(payouts) ? payouts.toArray() : payouts || [],
          assignee: assignee || null,
        }}
        validationSchema={validateFunding}
        setPayload={setPayload}
      >
        {({ status, values, dirty, isSubmitting, isValid }) => (
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
                    <Fragment>
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
                              addTokenFunding(values, arrayHelpers)
                            }
                          />
                        )}
                      </div>
                      {values.payouts &&
                        values.payouts.map((payout, index) => {
                          const { amount, token: tokenIndex } = payout;
                          const token =
                            availableTokens.get(tokenIndex - 1) || Token();
                          return (
                            <Payout
                              key={payout.id}
                              name={`payouts.${index}`}
                              amount={amount}
                              symbol={token.symbol}
                              reputation={
                                token.isNative ? reputation : undefined
                              }
                              isEth={token.isEth}
                              tokenOptions={tokenOptions}
                              remove={() => arrayHelpers.remove(index)}
                            />
                          );
                        })}
                    </Fragment>
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
                disabled={!dirty || !isValid}
                loading={isSubmitting}
              />
            </div>
          </Fragment>
        )}
      </ActionForm>
    </FullscreenDialog>
  );
};

TaskEditDialog.displayName = displayName;

export default TaskEditDialog;
