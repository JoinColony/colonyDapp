import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { FieldArray, ArrayHelpers } from 'formik';
import nanoid from 'nanoid';

import { ItemDataType } from '~core/OmniPicker';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import Button from '~core/Button';
import { Form, FormStatus } from '~core/Fields';
import { FullscreenDialog } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import Heading from '~core/Heading';
import DialogBox from '~core/Dialog/DialogBox';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import {
  AnyUser,
  AnyTask,
  useTaskToEditQuery,
  Payouts,
  useAssignWorkerMutation,
  useUnassignWorkerMutation,
  useSetTaskPayoutMutation,
  useRemoveTaskPayoutMutation,
  useLoggedInUser,
  UserTasksDocument,
  UserTasksQueryVariables,
} from '~data/index';
import { Address, createAddress } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';

import Payout, { FormPayout } from './Payout';

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

interface FormValues {
  payouts?: FormPayout[];
  worker?: AnyUser;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: string, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" />
);

const canAddTokens = (values, maxTokens) =>
  !maxTokens || (values.payouts && values.payouts.length < maxTokens);

const canRemoveTokens = (values, minTokens) =>
  !minTokens || (values.payouts && values.payouts.length > minTokens);

const removePayout = (arrayHelpers: ArrayHelpers, index: number) =>
  arrayHelpers.remove(index);

const resetPayout = (
  arrayHelpers: ArrayHelpers,
  index: number,
  payouts: Payouts,
) =>
  payouts.length > 0
    ? arrayHelpers.replace(index, payouts[index])
    : arrayHelpers.remove(index);

const displayName = 'dashboard.TaskEditDialog';

const TaskEditDialog = ({
  cancel,
  close: closeDialog,
  colonyAddress,
  draftId,
  maxTokens = Infinity,
  minTokens = 0,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
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
    (values: { payouts?: AnyTask['payouts'] }, helpers: () => void) => {
      if (canAddTokens(values, maxTokens))
        (helpers as any).push({
          id: nanoid(),
        });
    },
    [maxTokens],
  );

  const { data } = useTaskToEditQuery({
    variables: { id: draftId },
  });

  const [assignWorker] = useAssignWorkerMutation();
  const [unassignWorker] = useUnassignWorkerMutation();
  const [setTaskPayout] = useSetTaskPayoutMutation();
  const [removeTaskPayout] = useRemoveTaskPayoutMutation();

  const onSubmit = useCallback(
    ({ payouts, worker }: FormValues) => {
      // @todo Implement error handling with assignment/payout mutations

      const existingPayouts = data && data.task && data.task.payouts;

      // @todo Support multiple payouts on tasks
      const existingPayout =
        data &&
        data.task &&
        data.task.payouts &&
        data.task.payouts.length > 0 &&
        data.task.payouts[0];
      const existingWorkerAddress =
        data &&
        data.task &&
        data.task.assignedWorker &&
        data.task.assignedWorker.profile &&
        data.task.assignedWorker.profile.walletAddress;
      const isPayoutsChanged =
        !(payouts && payouts.length > 0 && existingPayouts) ||
        !payouts.some(({ amount, token }) =>
          existingPayouts.some(
            ({ amount: existingAmount, token: existingToken }) =>
              amount === existingAmount && token === existingToken.address,
          ),
        );

      const refetchSelfTasks = [
        {
          query: UserTasksDocument,
          variables: {
            address: walletAddress,
          } as UserTasksQueryVariables,
        },
      ];

      if (worker && worker.profile) {
        const isSelfAssigned =
          createAddress(walletAddress) ===
          createAddress(worker.profile.walletAddress);
        assignWorker({
          refetchQueries: isSelfAssigned ? refetchSelfTasks : [],
          variables: {
            input: { id: draftId, workerAddress: worker.profile.walletAddress },
          },
        });
      } else if (existingWorkerAddress) {
        // existing worker is set - unassign it
        const wasSelfAssigned =
          createAddress(walletAddress) === createAddress(existingWorkerAddress);
        unassignWorker({
          refetchQueries: wasSelfAssigned ? refetchSelfTasks : [],
          variables: {
            input: {
              id: draftId,
              workerAddress: existingWorkerAddress,
            },
          },
        });
      }

      if (isPayoutsChanged) {
        if (payouts && payouts.length > 0) {
          if (existingPayout) {
            // Since we currently only support 1 payout, unassign the old one first
            removeTaskPayout({
              variables: {
                input: {
                  id: draftId,
                  amount: existingPayout.amount,
                  tokenAddress: existingPayout.token.address,
                },
              },
            });
          }
          setTaskPayout({
            variables: {
              input: {
                id: draftId,
                amount: payouts[0].amount,
                tokenAddress: payouts[0].token,
              },
            },
          });
        } else if (existingPayout) {
          removeTaskPayout({
            variables: {
              input: {
                id: draftId,
                amount: existingPayout.amount,
                tokenAddress: existingPayout.token.address,
              },
            },
          });
        }
      }

      closeDialog();
    },
    [
      assignWorker,
      closeDialog,
      data,
      draftId,
      removeTaskPayout,
      setTaskPayout,
      unassignWorker,
      walletAddress,
    ],
  );

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
      colony: { subscribedUsers, tokens },
      payouts: initialPayouts,
      workRequests,
    },
  } = data;
  const users = [...workRequests, ...subscribedUsers];

  const initialValues: FormValues = {
    payouts: initialPayouts.map(({ amount, token }) => ({
      amount,
      token: token.address,
    })),
    worker: assignedWorker || undefined,
  };

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
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
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
                          values.payouts.map((payout, index, payouts) => (
                            <Payout
                              canRemove={canRemove}
                              colonyAddress={colonyAddress}
                              // wiill have at least one of `id` or `token`
                              key={payout.id || payout.token}
                              name={`payouts.${index}`}
                              payout={payout}
                              reputation={0}
                              remove={() => removePayout(arrayHelpers, index)}
                              reset={() =>
                                resetPayout(arrayHelpers, index, payouts)
                              }
                              tokens={tokens}
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
      </Form>
    </FullscreenDialog>
  );
};

TaskEditDialog.displayName = displayName;

export default TaskEditDialog;
