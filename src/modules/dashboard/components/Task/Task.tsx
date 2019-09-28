import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

import { ActionTypes } from '~redux/index';
import { useDataFetcher, useDataSubscriber, useSelector } from '~utils/hooks';
// Temporary, please remove when wiring in the rating modals
import { OpenDialog } from '~core/Dialog/types';
import { mergePayload } from '~utils/actions';
import Heading from '~core/Heading';
import withDialog from '~core/Dialog/withDialog';
import Button, { ActionButton, ConfirmButton } from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import LoadingTemplate from '~pages/LoadingTemplate';
import TaskAssignment from '~dashboard/TaskAssignment';
import TaskComments from '~dashboard/TaskComments';
import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskFeed from '~dashboard/TaskFeed';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskSkills from '~dashboard/TaskSkills';
import TaskTitle from '~dashboard/TaskTitle';
import {
  canCancelTask,
  canEditTask,
  canFinalizeTask,
  isCancelled,
  isCreator,
  isFinalized,
  isWorkerSet,
} from '../../checks';
import { currentUserSelector } from '../../../users/selectors';
import { colonyAddressFetcher } from '../../fetchers';
import { taskSubscriber } from '../../subscribers';
import styles from './Task.css';

const MSG = defineMessages({
  assignmentFunding: {
    id: 'dashboard.Task.assignmentFunding',
    defaultMessage: 'Assignee and Funding',
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
  finalizeTask: {
    id: 'dashboard.Task.finalizeTask',
    defaultMessage: 'Finalize task',
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
});

interface Props {
  match: any;
  openDialog: OpenDialog;
  history: any;
}

const displayName = 'dashboard.Task';

const Task = ({
  match: {
    params: { draftId, colonyName },
  },
  openDialog,
  history,
}: Props) => {
  const [isDiscardConfirmDisplayed, setDiscardConfirmDisplay] = useState(false);

  const currentUser = useSelector(currentUserSelector);
  const walletAddress =
    currentUser && currentUser.profile && currentUser.profile.walletAddress;

  const { data: colonyAddress } = useDataFetcher(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );

  const colonyArgs = [colonyAddress || undefined];
  const {
    data: permissions,
    isFetching: isFetchingPermissions,
  } = useDataFetcher(
    currentUserColonyPermissionsFetcher,
    colonyArgs as [string], // Technically a bug, shouldn't need type override
    colonyArgs,
  );

  const { data: task, isFetching: isFetchingTask } = useDataSubscriber(
    taskSubscriber,
    [draftId],
    [colonyAddress || undefined, draftId],
  );
  const {
    description = undefined,
    domainId = undefined,
    dueDate = undefined,
    skillId = undefined,
    title = undefined,
  } = task || {};

  const onEditTask = useCallback(() => {
    // If you've managed to click on the button that runs this without the
    // task being fetched yet, you are a wizard
    if (!task) {
      return;
    }

    openDialog('TaskEditDialog', {
      draftId,
      maxTokens: 1,
      minTokens: 0,
    });
  }, [draftId, openDialog, task]);

  const transform = useCallback(mergePayload({ colonyAddress, draftId }), [
    colonyAddress,
    draftId,
  ]);

  if (
    isFetchingTask ||
    isFetchingPermissions ||
    !task ||
    !colonyAddress ||
    !permissions ||
    !walletAddress
  ) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const isTaskCreator = isCreator(task, walletAddress);
  const canEdit = canEditTask(task, permissions, walletAddress);

  return (
    <div className={styles.main}>
      <aside className={styles.sidebar}>
        <section className={styles.section}>
          <header className={styles.headerAside}>
            <Heading
              appearance={{ size: 'normal' }}
              text={MSG.assignmentFunding}
            />
          </header>
          <div className={styles.assignment}>
            <div>
              <TaskAssignment colonyAddress={colonyAddress} draftId={draftId} />
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
            colonyAddress={colonyAddress}
            disabled={!canEdit}
            draftId={draftId}
            title={title}
          />
          <TaskDescription
            colonyAddress={colonyAddress}
            description={description}
            disabled={!canEdit}
            draftId={draftId}
          />
        </section>
        {!!(canEdit || dueDate || domainId || skillId) && (
          <section className={styles.section}>
            <div className={styles.editor}>
              <TaskDomains
                colonyAddress={colonyAddress}
                disabled={!canEdit}
                domainId={domainId}
                draftId={draftId}
              />
            </div>
            <div className={styles.editor}>
              <TaskSkills
                colonyAddress={colonyAddress}
                disabled={!canEdit}
                draftId={draftId}
                skillId={skillId}
              />
            </div>
            <div className={styles.editor}>
              <TaskDate
                colonyAddress={colonyAddress}
                disabled={!canEdit}
                draftId={draftId}
                dueDate={dueDate}
              />
            </div>
          </section>
        )}
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
          {canCancelTask(task, permissions, walletAddress) && (
            <ActionButton
              appearance={{ theme: 'secondary', size: 'small' }}
              button={ConfirmButton}
              confirmText={MSG.confirmText}
              onConfirmToggled={setDiscardConfirmDisplay}
              text={MSG.discardTask}
              submit={ActionTypes.TASK_CANCEL}
              error={ActionTypes.TASK_CANCEL_ERROR}
              success={ActionTypes.TASK_CANCEL_SUCCESS}
              transform={transform}
            />
          )}
          {/* Hide when discard confirm is displayed */}
          {!isDiscardConfirmDisplayed && (
            <>
              {canFinalizeTask(task, permissions, walletAddress) && (
                <ActionButton
                  text={MSG.finalizeTask}
                  submit={ActionTypes.TASK_FINALIZE}
                  error={ActionTypes.TASK_FINALIZE_ERROR}
                  success={ActionTypes.TASK_FINALIZE_SUCCESS}
                  transform={transform}
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
              {!isTaskCreator && !isWorkerSet(task) && !isCancelled(task) && (
                <TaskRequestWork
                  currentUser={currentUser}
                  task={task}
                  history={history}
                />
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
            <TaskFeed colonyAddress={colonyAddress} draftId={draftId} />
          </section>
          <section className={styles.commentBox}>
            <TaskComments
              colonyAddress={colonyAddress}
              draftId={draftId}
              taskTitle={title}
              history={history}
              currentUser={currentUser}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

Task.displayName = displayName;

const enhance = compose(
  withDialog(),
  withRouter,
) as any;

export default enhance(Task);
