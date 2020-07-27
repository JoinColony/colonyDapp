import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import TaskAssignment from '~dashboard/TaskAssignment';
import TaskComments from '~dashboard/TaskComments';
import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskFeed from '~dashboard/TaskFeed';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskSkills from '~dashboard/TaskSkills';
import TaskTitle from '~dashboard/TaskTitle';
import TaskFinalize from '~dashboard/TaskFinalize';
import TaskEditDialog from '~dashboard/TaskEditDialog';
import {
  useCancelTaskMutation,
  useColonyFromNameQuery,
  useLoggedInUser,
  useTaskQuery,
} from '~data/index';
import LoadingTemplate from '~pages/LoadingTemplate';
import { useTransformer } from '~utils/hooks';
import { NOT_FOUND_ROUTE } from '~routes/index';

import { getUserRolesForDomain } from '../../../transformers';
import {
  canCancelTask,
  canEditTask,
  canFinalizeTask,
  canRequestToWork,
  isCancelled,
  isFinalized,
} from '../../checks';

import styles from './Task.css';

const MSG = defineMessages({
  assignmentFunding: {
    id: 'dashboard.Task.assignmentFunding',
    defaultMessage: 'Assignee and Payout',
  },
  details: {
    id: 'dashboard.Task.details',
    defaultMessage: 'Details',
  },
  backButton: {
    id: 'dashboard.Task.backButton',
    defaultMessage: 'Go to {name}',
  },
  completed: {
    id: 'dashboard.Task.completed',
    defaultMessage: 'Task completed',
  },
  discarded: {
    id: 'dashboard.Task.discarded',
    defaultMessage: 'Task discarded',
  },
  discardTask: {
    id: 'dashboard.Task.discardTask',
    defaultMessage: 'Discard task',
  },
  confirmText: {
    id: 'dashboard.Task.confirmText',
    defaultMessage: 'Are you sure you want to discard this task?',
  },
  loadingText: {
    id: 'dashboard.Task.loadingText',
    defaultMessage: 'Loading task',
  },
  trustInfoTooltipHeading: {
    id: 'dashboard.Task.trustInfoTooltipHeading',
    defaultMessage: 'Task data is not stored on chain',
  },
  trustInfoTooltipBody: {
    id: 'dashboard.Task.trustInfoTooltipBody',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Admins can edit the task and remove the assignee without consent. Protect your work and ensure you trust whom you are working with.',
  },
  payoutInfo: {
    id: 'dashboard.Task.payoutInfo',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Each task has its own funding pot which allows you to set aside funds for payouts. The payouts for each role will be taken from the task's funding pot. The Colony fee will be deducted from each payout once the task is completed.",
  },
  helpIconTitle: {
    id: 'dashboard.Task.helpIconTitle',
    defaultMessage: 'Help',
  },
});

/**
 * @NOTE On the specific colony address type
 *
 * This came about as a result of hooking into the result of the colony query,
 * on the client side query, before it sends the result on to the server query,
 * and act upon that if that's in an error state (in which case, it won't actually
 * reach the server)
 *
 * See the comment below, where we actually set the reverseENSAddress for a more
 * in depth explanation.
 */
type SuperSpecificColonyAddress = string | Error;

const displayName = 'dashboard.Task';

const Task = () => {
  const { colonyName, draftId } = useParams<{
    colonyName: string;
    draftId: string;
  }>();
  const history = useHistory();
  const openDialog = useDialog(TaskEditDialog);

  const [
    isDiscardConfirmDisplayed,
    // setDiscardConfirmDisplay,
  ] = useState(false);

  const { walletAddress } = useLoggedInUser();

  const { data, error: taskFetchError } = useTaskQuery({
    // @todo use subscription for `Task` instead of `pollInterval` (once supported by server)
    pollInterval: 5000,
    variables: { id: draftId },
  });

  const {
    data: colonyData,
    /**
     * @NOTE Hooking into the return variable value
     *
     * Since this is a client side query it's return value will never end up
     * in the final result from the main query hook, either the value or the
     * eventual error.
     *
     * For this we hook into the `address` value which will be set internally
     * by the `@client` query so that we can act on it if we encounter an ENS
     * error.
     *
     * Based on that error we can determine if the colony is registered or not.
     */
    variables: { address: reverseENSAddress },
  } = useColonyFromNameQuery({
    variables: { address: '', name: colonyName },
  });

  const {
    task: {
      assignedWorkerAddress = undefined,
      description = undefined,
      ethDomainId = undefined,
      dueDate = undefined,
      ethSkillId = undefined,
      payouts = [],
      title = undefined,
    } = {},
    task = undefined,
  } = data || {};

  const userRoles = useTransformer(getUserRolesForDomain, [
    colonyData && colonyData.colony,
    walletAddress,
    ethDomainId,
  ]);

  const onEditTask = useCallback(() => {
    // If you've managed to click on the button that runs this without the
    // task being fetched yet, you are a wizard
    if (!task || !colonyData) {
      return;
    }
    openDialog({
      colonyAddress: colonyData.colonyAddress,
      draftId,
      maxTokens: 1,
      minTokens: 0,
    });
  }, [colonyData, draftId, openDialog, task]);

  const [handleCancelTask] = useCancelTaskMutation({
    variables: { input: { id: draftId } },
  });

  if (
    !colonyName ||
    (reverseENSAddress as SuperSpecificColonyAddress) instanceof Error ||
    taskFetchError
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!task || !colonyData || !walletAddress) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const { colony } = colonyData;
  const canEdit = canEditTask(task, userRoles);

  return (
    <div className={styles.main}>
      <aside className={styles.sidebar}>
        <section className={styles.section}>
          <header className={styles.headerAside}>
            <Heading
              appearance={{ size: 'normal' }}
              text={MSG.assignmentFunding}
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
          </header>
          <div className={styles.assignment}>
            <div>
              <TaskAssignment
                draftId={draftId}
                nativeTokenAddress={colony.nativeTokenAddress}
                tokens={colony.tokens}
              />
            </div>
            {canEdit && (
              <div className={styles.assignmentDetailsButton}>
                <Button
                  appearance={{ theme: 'blue' }}
                  text={MSG.details}
                  onClick={onEditTask}
                />
              </div>
            )}
          </div>
        </section>
        <section className={styles.section}>
          <TaskTitle
            disabled={!canEdit}
            draftId={draftId}
            title={title || undefined}
          />
          <TaskDescription
            description={description || undefined}
            disabled={!canEdit}
            draftId={draftId}
          />
        </section>
        <section className={styles.section}>
          {colony && colony.colonyAddress && (
            <div className={styles.editor}>
              <TaskDomains
                colonyAddress={colony.colonyAddress}
                // Disable the change of domain for now
                disabled
                ethDomainId={ethDomainId || ROOT_DOMAIN_ID}
                draftId={draftId}
                payouts={payouts}
              />
            </div>
          )}
          <div className={styles.editor}>
            <TaskSkills
              disabled={!canEdit}
              draftId={draftId}
              ethSkillId={ethSkillId || undefined}
            />
          </div>
          <div className={styles.editor}>
            <TaskDate
              disabled={!canEdit}
              draftId={draftId}
              dueDate={dueDate || undefined}
            />
          </div>
        </section>
      </aside>
      <div className={styles.container}>
        <section
          className={`${styles.header} ${
            isDiscardConfirmDisplayed ? styles.headerConfirm : ''
          }`}
        >
          {!isDiscardConfirmDisplayed && (
            <Tooltip
              content={
                <div className={styles.trustInfoTooltip}>
                  <p className={styles.trustInfoTooltipHeading}>
                    <FormattedMessage {...MSG.trustInfoTooltipHeading} />
                  </p>
                  <p>
                    <FormattedMessage {...MSG.trustInfoTooltipBody} />
                  </p>
                </div>
              }
              placement="right"
            >
              <div className={styles.trustInfoIcon}>
                <Icon
                  name="unlock"
                  /*
                   * Set to an empty string to prevent rendering
                   * Otherwise it will overlap with the tooltip which is already
                   * providing this functionality
                   */
                  title=""
                  appearance={{ size: 'small', theme: 'primary' }}
                />
              </div>
            </Tooltip>
          )}
          {canCancelTask(task, userRoles) && (
            <Button
              appearance={{ theme: 'secondary', size: 'small' }}
              // @todo Use `ConfirmButton` for discard task button
              // confirmText={MSG.confirmText}
              onClick={() => handleCancelTask()}
              // onConfirmToggled={setDiscardConfirmDisplay}
              text={MSG.discardTask}
            />
          )}
          {/* Hide when discard confirm is displayed */}
          {!isDiscardConfirmDisplayed && (
            <>
              {canFinalizeTask(task, userRoles) && (
                <TaskFinalize
                  draftId={draftId}
                  colonyAddress={colonyData.colonyAddress}
                  ethDomainId={ethDomainId || ROOT_DOMAIN_ID}
                  ethSkillId={ethSkillId}
                  payouts={payouts}
                  workerAddress={assignedWorkerAddress}
                />
              )}
              {isFinalized(task) && (
                <p className={styles.completedDescription}>
                  <FormattedMessage {...MSG.completed} />
                </p>
              )}
              {isCancelled(task) && (
                <p className={styles.completedDescription}>
                  <FormattedMessage {...MSG.discarded} />
                </p>
              )}
              {canRequestToWork(task, walletAddress) && (
                <TaskRequestWork task={task} history={history} />
              )}
            </>
          )}
          {/*
           Use these components for the full on-chain task workflow
           <TaskRatingButtons task={task} />
           <TaskClaimReward task={task} />
          */}
        </section>
        <div className={styles.activityContainer}>
          <section className={styles.activity}>
            <TaskFeed colonyAddress={colony.colonyAddress} draftId={draftId} />
          </section>
          <section className={styles.commentBox}>
            <TaskComments draftId={draftId} history={history} />
          </section>
        </div>
      </div>
    </div>
  );
};

Task.displayName = displayName;

export default Task;
