/* @flow */
import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import BigNumber from 'bn.js';
import * as yup from 'yup';
import { FieldArray } from 'formik';

import SingleUserPicker, {
  ItemDefault,
} from '~components/core/SingleUserPicker';
import Button from '~components/core/Button';
import { ActionForm, FormStatus } from '~components/core/Fields';
import { FullscreenDialog } from '~components/core/Dialog';
import DialogSection from '~components/core/Dialog/DialogSection.jsx';
import Heading from '~components/core/Heading';
import DialogBox from '~components/core/Dialog/DialogBox.jsx';

import Payout from './Payout.jsx';
import { tokenIsETH } from '~immutable/utils';

import type { UserType, TokenType, TaskPayoutType } from '~immutable';

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

type Props = {|
  assignee?: UserType,
  availableTokens: Array<TokenType>,
  maxTokens?: BigNumber,
  payouts?: Array<TaskPayoutType>,
  reputation?: BigNumber,
  users: Array<UserType>,
  cancel: () => void,
  addTokenFunding: (
    values: { payouts?: Array<any> },
    helpers: () => void,
  ) => void,
  setPayload: (action: Object, payload: Object) => Object,
|};

const filter = (data: Array<UserType>, filterValue) =>
  data.filter(
    user =>
      user.profile.username &&
      user.profile.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

const displayName = 'dashboard.TaskEditDialog';

const TaskEditDialog = ({
  cancel,
  reputation,
  payouts,
  assignee,
  maxTokens,
  availableTokens,
  users,
  addTokenFunding,
  setPayload,
}: Props) => {
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
  const tokenOptions = availableTokens.map(({ symbol }, i) => ({
    value: i + 1,
    label: symbol,
  }));

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
        submit="CREATE_COOL_THING"
        success="COOL_THING_CREATED"
        error="COOL_THING_CREATE_ERROR"
        initialValues={{
          payouts: payouts || [],
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
                          const token = availableTokens[tokenIndex - 1] || {};
                          return (
                            <Payout
                              key={payout.id}
                              name={`payouts.${index}`}
                              amount={amount}
                              symbol={token.symbol}
                              reputation={
                                token.isNative ? reputation : undefined
                              }
                              isEth={tokenIsETH(token)}
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
