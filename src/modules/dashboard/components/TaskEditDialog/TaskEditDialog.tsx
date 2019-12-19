import React, { useCallback, useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { FieldArray } from 'formik';
import nanoid from 'nanoid';
import { subscribeActions as subscribeToReduxActions } from 'redux-action-watch/lib/actionCreators';
import { useDispatch } from 'redux-react-hook';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { TaskPayoutType } from '~immutable/index';
import { ItemDataType } from '~core/OmniPicker';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { ActionForm, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import Heading from '~core/Heading';
import DialogBox from '~core/Dialog/DialogBox';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ActionTypes } from '~redux/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { AnyUser, AnyTask, useTaskToEditQuery } from '~data/index';
import { Address } from '~types/index';

import WrappedPayout from './WrappedPayout';

import styles from './TaskEditDialog.css';

const MSG = defineMessages({
  titleAssignment: {
    id: 'dashboard.TaskEditDialog.titleAssignment',
    defaultMessage: 'Assignment',
  },
  titleFunding: {
    id: 'dashboard.TaskEditDialog.titleFunding',
    defaultMessage: 'Payout',
  },
  add: {
    id: 'dashboard.TaskEditDialog.add',
    defaultMessage: 'Add +',
  },
  notSet: {
    id: 'dashboard.TaskEditDialog.notSet',
    defaultMessage: 'Not set',
  },
  search: {
    id: 'dashboard.TaskEditDialog.search',
    defaultMessage: 'Search...',
  },
  selectAssignee: {
    id: 'dashboard.TaskEditDialog.selectAssignee',
    defaultMessage: 'Select Assignee',
  },
  workerRequiredError: {
    id: 'dashboard.TaskEditDialog.workerRequiredError',
    defaultMessage: 'Please select a worker.',
  },
  tokenRequiredError: {
    id: 'dashboard.TaskEditDialog.tokenRequiredError',
    defaultMessage: 'Token required',
  },
  amountPositiveError: {
    id: 'dashboard.TaskEditDialog.amountPositiveError',
    defaultMessage: 'Amount must be a positive number.',
  },
  amountRequiredError: {
    id: 'dashboard.TaskEditDialog.amountRequiredError',
    defaultMessage: 'Amount required',
  },
  payoutInfo: {
    id: 'dashboard.TaskEditDialog.payoutInfo',
    defaultMessage:
      // eslint-disable-next-line max-len
      'The worker will receive their payout at the end of the task. Make sure you have enough funds in the task to match the payout',
  },
  helpIconTitle: {
    id: 'dashboard.TaskEditDialog.helpIconTitle',
    defaultMessage: 'Help',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  colonyAddress: Address;
  draftId: AnyTask['id'];
  maxTokens?: number;
  minTokens?: number;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: string, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" />
);

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

const canRemoveTokens = (values, minTokens) =>
  !minTokens || (values.payouts && values.payouts.length > minTokens);

const displayName = 'dashboard.TaskEditDialog';

const TaskEditDialog = ({
  cancel,
  close: closeDialog,
  colonyAddress,
  draftId,
  maxTokens = Infinity,
  minTokens = 0,
}: Props) => {
  // @TODO check for sufficient funds (asynchronous validation)
  const validateForm = useMemo(() => {
    const workerShape = yup
      .object()
      .shape({
        profile: yup.object().shape({
          walletAddress: yup.string().required(MSG.workerRequiredError),
        }),
      })
      .nullable()
      .default(null);
    return yup.object().shape({
      payouts: yup
        .array()
        .of(
          yup.object().shape({
            token: yup.string().required(MSG.tokenRequiredError),
            amount: yup
              .number()
              .typeError(MSG.amountPositiveError)
              .required(MSG.amountRequiredError)
              .moreThan(0, MSG.amountPositiveError),
          }),
        )
        .min(minTokens)
        .max(maxTokens)
        .nullable()
        .default(null),
      worker: workerShape,
    });
  }, [maxTokens, minTokens]);

  const addTokenFunding = useCallback(
    (values: { payouts?: TaskPayoutType[] }, helpers: () => void) => {
      if (canAddTokens(values, maxTokens))
        (helpers as any).push({
          id: nanoid(),
        });
    },
    [maxTokens],
  );

  const dispatch = useDispatch();

  /*
   * @NOTE this needs to return the `subscribeToReduxActions` function, since that returns an
   * unsubscriber, and that gets called when the component is unmounted
   */
  useEffect(
    () =>
      subscribeToReduxActions(dispatch)({
        /*
         * @NOTE All this is needed in order to shortcircuit re-rendering the TaskEditDialog
         * There's a edge case that's happening here:
         * - ActionForm submits the values
         * - Formik after submitting the values causes this component to re-render
         * - In some cases it happens so fast, it actually re-renders before the success action being dispatched
         * - That prevents ActionForm from acting on the success action so the `onSuccess` callback never gets called
         *
         * This works, since only one payout success will ever be dispatched while this Dialog is opened
         * so there's no danger of this being closed prematurely
         */
        [ActionTypes.TASK_SET_WORKER_OR_PAYOUT_SUCCESS]: () => closeDialog(),
      }),
    [dispatch, closeDialog],
  );

  const { data } = useTaskToEditQuery({
    variables: { id: draftId },
  });

  if (!data) {
    return (
      <FullscreenDialog cancel={cancel}>
        <SpinnerLoader />
      </FullscreenDialog>
    );
  }

  const {
    task: {
      assignedWorker,
      colony: { subscribedUsers },
      payouts,
      workRequests,
    },
  } = data;
  const users = [...workRequests, ...subscribedUsers];

  // FIXME This needs to be handled entirely without a saga
  // FIXME close dialog after success

  return (
    <FullscreenDialog
      cancel={cancel}
      /*
       * Setting `isDismissable` to `false` because we don't want a user to
       * be able to close this Dialog after they've submitted the form
       * (while it's processing the data).
       *
       * We can't wrap the Dialog within the form (to use `isSubmitting`),
       * because `react-modal` uses Portals, thus the form wouldn't be
       * able to be submitted.
       */
      isDismissable={false}
    >
      <ActionForm
        initialValues={{
          payouts,
          worker: assignedWorker,
        }}
        error={ActionTypes.TASK_SET_WORKER_OR_PAYOUT_ERROR}
        submit={ActionTypes.TASK_SET_WORKER_OR_PAYOUT}
        success={ActionTypes.TASK_SET_WORKER_OR_PAYOUT_SUCCESS}
        onSuccess={closeDialog}
        validationSchema={validateForm}
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
                    filter={filterUserSelection}
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
                          <Tooltip
                            placement="right"
                            content={
                              <div className={styles.tooltipText}>
                                <FormattedMessage {...MSG.payoutInfo} />
                              </div>
                            }
                          >
                            <button className={styles.helpButton} type="button">
                              <Icon
                                appearance={{
                                  size: 'small',
                                  theme: 'invert',
                                }}
                                name="question-mark"
                                title={MSG.helpIconTitle}
                              />
                            </button>
                          </Tooltip>
                          {canAddTokens(values, maxTokens) && (
                            <Button
                              appearance={{ theme: 'blue', size: 'small' }}
                              text={MSG.add}
                              onClick={() =>
                                addTokenFunding(values, arrayHelpers as any)
                              }
                            />
                          )}
                        </div>
                        {values.payouts &&
                          values.payouts.map((payout, index) => (
                            <WrappedPayout
                              arrayHelpers={arrayHelpers}
                              canRemove={canRemove}
                              colonyAddress={colonyAddress}
                              index={index}
                              key={payout.id}
                              payout={payout}
                              payouts={payouts}
                              reputation={0}
                              /* FIXME This needs to be handled somehow */
                              tokens={[]}
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
    </FullscreenDialog>
  );
};

TaskEditDialog.displayName = displayName;

export default TaskEditDialog;
