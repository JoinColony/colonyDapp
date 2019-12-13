import React, { useCallback, useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { FieldArray } from 'formik';
import nanoid from 'nanoid';
import moveDecimal from 'move-decimal-point';
import BigNumber from 'bn.js';
import { subscribeActions as subscribeToReduxActions } from 'redux-action-watch/lib/actionCreators';
import { useDispatch } from 'redux-react-hook';
import { useQuery } from '@apollo/react-hooks';

import {
  TaskPayoutType,
  ColonyTokenReferenceType,
  TokenType,
} from '~immutable/index';
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
import { mapPayload, mergePayload, pipe } from '~utils/actions';
import { useDataFetcher, useSelector } from '~utils/hooks';
import { AnyUser, ColonySubscribedUsersDocument } from '~data/index';

import { createAddress } from '../../../../types';
import { useColonyTokens } from '../../hooks/useColonyTokens';
import { colonyFetcher } from '../../fetchers';
import { taskSelector } from '../../selectors';
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
  insufficientFundsError: {
    id: 'dashboard.TaskEditDialog.insufficientFundsError',
    defaultMessage: "You don't have enough funds",
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
  unknownToken: {
    id: 'dashboard.TaskEditDialog.unknownToken',
    defaultMessage: 'Unknown Token',
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
  draftId: string;
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
  draftId,
  maxTokens = Infinity,
  minTokens = 0,
}: Props) => {
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

  // @TODO get the task data from db and extend all users in the task (worker, requested?)
  const task = useSelector(taskSelector, [draftId]);

  const colonyAddress =
    task && task.record ? task.record.colonyAddress : undefined;
  const { data: colonyData, isFetching: isFetchingColony } = useDataFetcher(
    colonyFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const [colonyTokenReferences, availableTokens] = useColonyTokens(
    colonyAddress,
  ) as [ColonyTokenReferenceType[], TokenType[]];

  const { data: subscribedUsersData } = useQuery(
    ColonySubscribedUsersDocument,
    {
      variables: { colonyAddress },
    },
  );

  const subscribedColonyUsers =
    (subscribedUsersData && subscribedUsersData.colony.subscribedUsers) || [];

  // FIXME This is temporarily to not break everything
  task.workRequests = [];
  task.worker = {
    profile: { walletAddress: '0x9df24e73f40b2a911eb254a8825103723e13209c' },
  };

  /* Eventually we want to get the data like this:
   * task(id: String!) {
      workRequests {
        id
        profile {
          ..
        }
      }
      colony {
       subscribedUsers {
        id
        profile {
         displayName
         walletAddress
         username
         avatarHash
       }
      }
    }
   */
  const existingWorker = task.worker;

  const users = [...task.workRequests, ...subscribedColonyUsers];

  const taskPayouts = task && task.record ? task.record.payouts : [];
  const existingPayouts = useMemo(
    () =>
      taskPayouts.map(payout => {
        const { address = undefined, decimals = 18 } =
          (availableTokens &&
            availableTokens.find(token => token.address === payout.token)) ||
          {};
        return {
          token: address,
          amount: moveDecimal(
            new BigNumber(payout.amount).toString(10),
            -1 * decimals,
          ),
          id: payout.token.address,
        };
      }),
    [availableTokens, taskPayouts],
  );

  const domainId = task && task.record ? task.record.domainId : undefined;
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
              .moreThan(0, MSG.amountPositiveError)
              // @ts-ignore
              .lessThanPot(
                colonyTokenReferences,
                domainId,
                availableTokens,
                MSG.insufficientFundsError,
              ),
          }),
        )
        .min(minTokens)
        .max(maxTokens)
        .nullable()
        .default(null),
      worker: workerShape,
    });
  }, [availableTokens, colonyTokenReferences, domainId, maxTokens, minTokens]);

  const tokenOptions = useMemo(
    () =>
      availableTokens &&
      availableTokens.map(({ address, symbol }) => ({
        value: address,
        label: symbol || MSG.unknownToken,
      })),
    [availableTokens],
  );

  const addTokenFunding = useCallback(
    (values: { payouts?: TaskPayoutType[] }, helpers: () => void) => {
      if (canAddTokens(values, maxTokens))
        (helpers as any).push({
          id: nanoid(),
        });
    },
    [maxTokens],
  );

  const transform = useCallback(
    pipe(
      mapPayload(p => ({
        payouts: p.payouts.map(({ amount, token }) => {
          const { decimals = undefined } =
            (availableTokens &&
              availableTokens.find(
                ({ address: refAddress }) => refAddress === token,
              )) ||
            {};
          return {
            amount: new BigNumber(moveDecimal(amount, decimals || 18)),
            token,
          };
        }),
        workerAddress:
          p.worker && p.worker.profile && p.worker.profile.walletAddress
            ? createAddress(p.worker.profile.walletAddress)
            : undefined,
      })),
      mergePayload({ colonyAddress, draftId }),
    ),
    [colonyAddress, draftId],
  );

  // FIXME do actual checks if something is loading
  const loading = false;

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
      {loading ? (
        <SpinnerLoader />
      ) : (
        <ActionForm
          initialValues={{
            payouts: existingPayouts,
            worker: existingWorker,
          }}
          error={ActionTypes.TASK_SET_WORKER_OR_PAYOUT_ERROR}
          submit={ActionTypes.TASK_SET_WORKER_OR_PAYOUT}
          success={ActionTypes.TASK_SET_WORKER_OR_PAYOUT_SUCCESS}
          transform={transform}
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
                              <button
                                className={styles.helpButton}
                                type="button"
                              >
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
                          {colonyData ? (
                            <>
                              {colonyTokenReferences &&
                                values.payouts &&
                                values.payouts.map((payout, index) => (
                                  <WrappedPayout
                                    arrayHelpers={arrayHelpers}
                                    canRemove={canRemove}
                                    colonyAddress={colonyAddress}
                                    index={index}
                                    key={payout.id}
                                    payout={payout}
                                    payouts={existingPayouts}
                                    reputation={
                                      task && task.record
                                        ? task.record.reputation
                                        : undefined
                                    }
                                    tokenOptions={tokenOptions as any}
                                    tokenReferences={colonyTokenReferences}
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
