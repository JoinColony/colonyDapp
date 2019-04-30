/* @flow */

// $FlowFixMe until we have new react flow types with hooks
import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { FieldArray } from 'formik';

import type { ColonyType, UserType, TaskType, TokenType } from '~immutable';
import type { $Pick } from '~types';
import type { ItemDataType } from '~core/OmniPicker';

import SingleUserPicker from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import DialogBox from '~core/Dialog/DialogBox.jsx';
import { SpinnerLoader } from '~core/Preloaders';
import HookedUserAvatar from '~users/HookedUserAvatar';

import WrappedPayout from './WrappedPayout.jsx';
import { useDataFetcher, useDataMapFetcher, useSelector } from '~utils/hooks';
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
  amountRequiredError: {
    id: 'dashboard.Task.taskEditDialog.amountRequiredError',
    defaultMessage: 'Amount required',
  },
  unknownToken: {
    id: 'dashboard.Task.taskEditDialog.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

type Props = {|
  ...$Exact<$Pick<TaskType, {| workerAddress: *, payouts: *, reputation: * |}>>,
  addTokenFunding: (
    values: { payouts?: Array<any> },
    helpers: () => void,
  ) => void,
  cancel: () => void,
  draftId: string,
  maxTokens?: number,
  minTokens?: number,
  transform: (action: Object) => Object,
  walletAddress: string,
|};

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supFilter = (data, filterValue) => {
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
  addTokenFunding,
  cancel,
  draftId,
  maxTokens,
  minTokens,
  payouts: taskPayouts,
  reputation,
  transform,
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
  const userAddresses = useSelector(taskRequestsSelector, [draftId]);
  const userData = useDataMapFetcher<UserType>(
    usersByAddressFetcher,
    userAddresses,
  );

  // Get user (worker) assigned to this task
  const args = [workerAddress];
  const {
    data: worker,
    isFetching: isFetchingWorker,
  } = useDataFetcher<UserType>(userFetcher, args, args);

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
  const payouts = useMemo(
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
                .lessThanPot(colonyTokenReferences, MSG.insufficientFundsError),
            }),
          )
          .max(maxTokens),
      }),
    [colonyTokenReferences, maxTokens],
  );

  const tokenOptions = useMemo(
    () =>
      availableTokens.map(({ address, symbol }) => ({
        value: address,
        label: symbol || MSG.unknownToken,
      })),
    [availableTokens],
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
      {isFetchingWorker ? (
        <SpinnerLoader />
      ) : (
        <ActionForm
          /* In #1048 use correct actions */
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
                                    payouts={values.payouts}
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
        </ActionForm>
      )}
    </FullscreenDialog>
  );
};

TaskEditDialog.displayName = displayName;

export default TaskEditDialog;
