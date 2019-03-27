/* @flow */

// $FlowFixMe until we have new react flow types with hooks
import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { FieldArray } from 'formik';

import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import DialogBox from '~core/Dialog/DialogBox.jsx';
import { SpinnerLoader } from '~core/Preloaders';

import WrappedPayout from './WrappedPayout.jsx';
import { useDataFetcher } from '~utils/hooks';
import { userFetcher } from '../../../users/fetchers';

import type { UserType, TokenType, TaskType } from '~immutable';
import type { $Pick } from '~types';

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
  ...$Exact<$Pick<TaskType, {| worker: *, payouts: *, reputation: * |}>>,
  addTokenFunding: (
    values: { payouts?: Array<any> },
    helpers: () => void,
  ) => void,
  availableTokens: Array<TokenType>,
  cancel: () => void,
  maxTokens?: number,
  minTokens?: number,
  transform: (action: Object) => Object,
  users: Array<UserType>,
|};

const supFilter = (data, filterValue) => {
  const filtered = data.filter(
    user =>
      user &&
      filterValue &&
      user.profile.username.toLowerCase().includes(filterValue.toLowerCase()),
  );

  if (!filterValue) return filtered;

  const customValue = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customValue].concat(filtered);
};

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

const canRemoveTokens = (values, minTokens) =>
  !minTokens || (values.payouts && values.payouts.length > minTokens);

const displayName = 'dashboard.TaskEditDialog';

const TaskEditDialog = ({
  addTokenFunding,
  availableTokens,
  cancel,
  maxTokens,
  minTokens,
  payouts,
  reputation,
  transform,
  users,
  worker: { address: workerAddress } = {},
}: Props) => {
  const validateFunding = useMemo(
    () =>
      yup.object().shape({
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
      }),
    [maxTokens, availableTokens],
  );
  const tokenOptions = useMemo(
    () =>
      availableTokens.map(({ symbol }, i) => ({
        value: i + 1,
        label: symbol,
      })),
    [availableTokens],
  );
  const args = [workerAddress];
  const {
    data: worker,
    isFetching: isFetchingWorker,
  } = useDataFetcher<UserType>(userFetcher, args, args, {
    ttl: 1000 * 30, // 30 seconds
  });

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
      {isFetchingWorker ? (
        <SpinnerLoader />
      ) : (
        <ActionForm
          /* $FlowFixMe */
          submit="CREATE_COOL_THING"
          /* $FlowFixMe */
          success="COOL_THING_CREATED"
          /* $FlowFixMe */
          error="COOL_THING_CREATE_ERROR"
          initialValues={{
            payouts,
            worker,
          }}
          validationSchema={validateFunding}
          transform={transform}
        >
          {({ status, values, dirty, isSubmitting, isValid }) => {
            const canRemove = canRemoveTokens(values, minTokens);
            return (
              <>
                <FormStatus status={status} />
                <DialogBox>
                  <DialogSection appearance={{ border: 'bottom' }}>
                    <Heading
                      appearance={{ size: 'medium' }}
                      text={MSG.titleAssignment}
                    />
                    <SingleUserPicker
                      data={users}
                      isResettable
                      itemComponent={ItemDefault}
                      label={MSG.selectAssignee}
                      name="worker"
                      filter={supFilter}
                      placeholder={MSG.search}
                    />
                  </DialogSection>
                  <DialogSection>
                    <FieldArray
                      name="payouts"
                      render={arrayHelpers => (
                        <>
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
                            values.payouts.map((payout, index) => (
                              <WrappedPayout
                                key={payout.id}
                                arrayHelpers={arrayHelpers}
                                payouts={payouts}
                                payout={payout}
                                availableTokens={availableTokens}
                                canRemove={canRemove}
                                index={index}
                                reputation={reputation}
                                tokenOptions={tokenOptions}
                              />
                            ))}
                        </>
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
              </>
            );
          }}
        </ActionForm>
      )}
    </FullscreenDialog>
  );
};

TaskEditDialog.displayName = displayName;

export default TaskEditDialog;
