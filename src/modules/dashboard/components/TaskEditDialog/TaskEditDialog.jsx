/* @flow */

import type { FormikBag } from 'formik';

// $FlowFixMe until we have new react flow types with hooks
import React, { useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { FieldArray } from 'formik';
import nanoid from 'nanoid';

import type {
  ColonyType,
  UserType,
  TaskPayoutType,
  TaskType,
  TokenType,
} from '~immutable';
import type { $Pick } from '~types';
import type { ItemDataType } from '~core/OmniPicker';

import SingleUserPicker from '~core/SingleUserPicker';
import Button from '~core/Button';
import { Form, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import DialogBox from '~core/Dialog/DialogBox.jsx';
import { SpinnerLoader } from '~core/Preloaders';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { ACTIONS } from '~redux';

import WrappedPayout from './WrappedPayout.jsx';
import {
  useAsyncFunction,
  useDataFetcher,
  useDataMapFetcher,
  useSelector,
} from '~utils/hooks';
import { colonyFetcher } from '../../fetchers';
import {
  allFromColonyTokensSelector,
  colonyTokensSelector,
  taskSelector,
  taskRequestsSelector,
} from '../../selectors';
import { userFetcher, usersByAddressFetcher } from '../../../users/fetchers';

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
  amountPositiveError: {
    id: 'dashboard.Task.taskEditDialog.amountPositiveError',
    defaultMessage: 'Amount must be a positive number.',
  },
  amountRequiredError: {
    id: 'dashboard.Task.taskEditDialog.amountRequiredError',
    defaultMessage: 'Amount required',
  },
  unknownToken: {
    id: 'dashboard.Task.taskEditDialog.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

type FormValues = {|
  payouts: Array<TaskPayoutType>,
  worker?: UserType,
|};

type Props = {|
  ...$Exact<$Pick<TaskType, {| workerAddress: *, payouts: *, reputation: * |}>>,
  cancel: () => void,
  close: () => void,
  draftId: string,
  maxTokens?: number,
  minTokens?: number,
|};

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supFilter = (data, filterValue) => {
  if (!filterValue) {
    return data;
  }

  const filtered = data.filter(
    user =>
      user &&
      filterValue &&
      (user.profile.username
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
        user.profile.walletAddress
          .toLowerCase()
          .includes(filterValue.toLowerCase())),
  );

  const customValue = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customValue].concat(filtered);
};

const supRenderAvatar = (address: string, item: ItemDataType<UserType>) => {
  const { id, ...user } = item;
  return <UserAvatar address={address} user={user} size="xs" />;
};

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

const canRemoveTokens = (values, minTokens) =>
  !minTokens || (values.payouts && values.payouts.length > minTokens);

const displayName = 'dashboard.TaskEditDialog';

const TaskEditDialog = ({
  cancel,
  close: closeDialog,
  draftId,
  maxTokens,
  minTokens,
  payouts: taskPayouts,
  reputation,
  workerAddress,
}: Props) => {
  const {
    record: { colonyAddress },
  } = useSelector(taskSelector, [draftId]);
  const {
    data: colonyData,
    isFetching: isFetchingColony,
  } = useDataFetcher<ColonyType>(
    colonyFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  // Get this task's colony's token references
  const colonyTokenReferences = useSelector(colonyTokensSelector, [
    colonyAddress,
  ]);

  // Get tokens using token references
  const availableTokens: Array<TokenType> = useSelector(
    allFromColonyTokensSelector,
    [colonyTokenReferences],
  );

  // Get users that have requested to work on this task
  const userAddressesRequested = useSelector(taskRequestsSelector, [draftId]);
  /*
   * @todo: Get addresses of all users subscribed to this colony
   * @body: Likely use another selector to accomplish this
   */
  const userAddressesSubscribed = [];
  const userAddresses = [...userAddressesRequested, ...userAddressesSubscribed];
  const userData = useDataMapFetcher<UserType>(
    usersByAddressFetcher,
    userAddresses,
  );

  // Get user (worker) assigned to this task
  const {
    data: existingWorker,
    isFetching: isFetchingExistingWorker,
  } = useDataFetcher<UserType>(userFetcher, [workerAddress], [workerAddress]);

  const users = useMemo(
    () =>
      userData
        .filter(({ data }) => !!data)
        .map(({ data, key }) => ({
          id: key,
          ...data,
        })),
    [userData],
  );

  // consider using a selector for this in #1048
  const existingPayouts = useMemo(
    () =>
      taskPayouts.map(payout => ({
        token:
          // we add 1 because Formik thinks 0 is empty
          availableTokens.indexOf(
            availableTokens.find(
              token => token.address === payout.token.address,
            ),
          ) + 1,
        amount: payout.amount,
        id: payout.token.address,
      })),
    [taskPayouts, availableTokens],
  );

  const validateFunding = useMemo(
    () => {
      const workerShape = yup.object().shape({
        profile: yup.object().shape({
          walletAddress: yup.string().required(),
        }),
      });
      return yup.object().shape({
        payouts: yup
          .array()
          .of(
            yup.object().shape({
              token: yup.string().required(MSG.tokenRequiredError),
              amount: yup
                .number(MSG.amountPositiveError)
                .required(MSG.amountRequiredError)
                .moreThan(0, MSG.amountPositiveError)
                .lessThanPot(colonyTokenReferences, MSG.insufficientFundsError),
            }),
          )
          .when('worker', {
            is: workerShape,
            then: yup
              .array()
              .min(minTokens)
              .max(maxTokens),
          }),
        worker: workerShape,
      });
    },
    [colonyTokenReferences, maxTokens, minTokens],
  );

  const tokenOptions = useMemo(
    () =>
      availableTokens.map(({ address, symbol }) => ({
        value: address,
        label: symbol || MSG.unknownToken,
      })),
    [availableTokens],
  );

  const addTokenFunding = useCallback(
    (values: { payouts?: Array<TaskPayoutType> }, helpers: () => void) => {
      if (canAddTokens(values, maxTokens))
        helpers.push({
          id: nanoid(),
        });
    },
    [maxTokens],
  );

  const assignWorker = useAsyncFunction({
    error: ACTIONS.TASK_WORKER_ASSIGN_ERROR,
    submit: ACTIONS.TASK_WORKER_ASSIGN,
    success: ACTIONS.TASK_WORKER_ASSIGN_SUCCESS,
  });

  const setPayout = useAsyncFunction({
    error: ACTIONS.TASK_SET_PAYOUT_ERROR,
    submit: ACTIONS.TASK_SET_PAYOUT,
    success: ACTIONS.TASK_SET_PAYOUT_SUCCESS,
  });

  const setPayouts = useCallback(
    async (payouts: Array<TaskPayoutType>) => {
      const promises = payouts.map(({ amount, token }) =>
        setPayout({ amount, colonyAddress, draftId, token }),
      );
      await Promise.all(promises);
    },
    [colonyAddress, draftId, setPayout],
  );

  const handleSubmit = useCallback(
    (
      { payouts, worker }: FormValues,
      { setSubmitting }: FormikBag<{}, FormValues>,
    ) => {
      // disallow changes after payouts set for MVP
      if (existingPayouts.length > 0 || !worker) {
        setSubmitting(false);
        return;
      }

      assignWorker({
        colonyAddress,
        draftId,
        workerAddress: worker.profile.walletAddress,
      }).then(() => {
        // then set the payouts - can't set payouts without a worker
        setPayouts(payouts).then(() => {
          setSubmitting(false);
          closeDialog();
        });
      });
    },
    [
      assignWorker,
      closeDialog,
      colonyAddress,
      draftId,
      existingPayouts.length,
      setPayouts,
    ],
  );

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
      {isFetchingExistingWorker ? (
        <SpinnerLoader />
      ) : (
        <Form
          initialValues={{
            payouts: existingPayouts,
            worker: existingWorker,
          }}
          onSubmit={handleSubmit}
          validationSchema={validateFunding}
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
                      label={MSG.selectAssignee}
                      name="worker"
                      filter={supFilter}
                      placeholder={MSG.search}
                      renderAvatar={supRenderAvatar}
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
                          {colonyData ? (
                            <>
                              {values.payouts &&
                                values.payouts.map((payout, index) => (
                                  <WrappedPayout
                                    key={payout.id}
                                    arrayHelpers={arrayHelpers}
                                    payouts={existingPayouts}
                                    payout={payout}
                                    availableTokens={availableTokens}
                                    canRemove={canRemove}
                                    index={index}
                                    reputation={reputation}
                                    tokenOptions={tokenOptions}
                                  />
                                ))}
                            </>
                          ) : (
                            <>{isFetchingColony ? <SpinnerLoader /> : null}</>
                          )}
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
        </Form>
      )}
    </FullscreenDialog>
  );
};

TaskEditDialog.displayName = displayName;

export default TaskEditDialog;
