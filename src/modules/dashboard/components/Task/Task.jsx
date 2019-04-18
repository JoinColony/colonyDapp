/* @flow */

import type { Match } from 'react-router';

// $FlowFixMe
import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ACTIONS } from '~redux';
import { useDataFetcher, useSelector } from '~utils/hooks';

// Temporary, please remove when wiring in the rating modals
import type { OpenDialog } from '~core/Dialog/types';

import Heading from '~core/Heading';
import withDialog from '~core/Dialog/withDialog';
import Button, { ActionButton, ConfirmButton } from '~core/Button';
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
  isCreator,
  isFinalized,
} from '../../checks';
import { currentUserSelector } from '../../../users/selectors';
import { taskFetcher } from '../../fetchers';

import styles from './Task.css';

const MSG = defineMessages({
  assignmentFunding: {
    id: 'dashboard.Task.assignmentFunding',
    defaultMessage: 'Assignment and funding',
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
});

type Props = {|
  match: Match,
  openDialog: OpenDialog,
|};

const displayName = 'dashboard.Task';

const Task = ({
  match: {
    params: { draftId, colonyName },
  },
  openDialog,
}: Props) => {
  const [isDiscardConfirmDisplayed, setDiscardConfirmDisplay] = useState(false);

  const currentUser = useSelector(currentUserSelector);
  const { walletAddress } = currentUser.profile;

  const { data: task, isFetching: isFetchingTask } = useDataFetcher(
    taskFetcher,
    [draftId],
    [draftId],
  );
  const {
    colonyAddress,
    description,
    domainId,
    dueDate,
    payouts,
    reputation,
    skillId,
    title,
    workerAddress,
  } = task || {};

  const onEditTask = useCallback(
    () => {
      // If you've managed to click on the button that runs this without the
      // task being fetched yet, you are a wizard
      if (!task) return;

      openDialog('TaskEditDialog', {
        draftId,
        maxTokens: 2,
        payouts,
        reputation,
        workerAddress,
      });
    },
    [draftId, openDialog, payouts, reputation, task, workerAddress],
  );

  if (isFetchingTask || !task)
    return <LoadingTemplate loadingText={MSG.loadingText} />;

  const isTaskCreator = isCreator(task, walletAddress);

  const setActionButtonValues = () => ({ colonyName, draftId });

  return (
    <div className={styles.main}>
      <aside className={styles.sidebar}>
        <section className={styles.section}>
          <header className={styles.headerAside}>
            <Heading
              appearance={{ size: 'normal' }}
              text={MSG.assignmentFunding}
            />
            {!canEditTask(task, walletAddress) && (
              <Button
                appearance={{ theme: 'blue' }}
                text={MSG.details}
                onClick={onEditTask}
              />
            )}
          </header>
          <TaskAssignment
            colonyAddress={colonyAddress}
            draftId={draftId}
            payouts={payouts}
            reputation={reputation}
            workerAddress={workerAddress}
          />
        </section>
        <section className={styles.section}>
          <TaskTitle
            colonyAddress={colonyAddress}
            draftId={draftId}
            isTaskCreator={isTaskCreator}
            title={title}
          />
          <TaskDescription
            colonyAddress={colonyAddress}
            description={description}
            draftId={draftId}
            isTaskCreator={isTaskCreator}
          />
        </section>
        <section className={styles.section}>
          <div className={styles.editor}>
            <TaskDomains
              colonyAddress={colonyAddress}
              domainId={domainId}
              draftId={draftId}
              isTaskCreator={isTaskCreator}
            />
          </div>
          <div className={styles.editor}>
            <TaskSkills
              colonyAddress={colonyAddress}
              draftId={draftId}
              isTaskCreator={isTaskCreator}
              skillId={skillId}
            />
          </div>
          <div className={styles.editor}>
            <TaskDate
              colonyAddress={colonyAddress}
              draftId={draftId}
              isTaskCreator={isTaskCreator}
              dueDate={dueDate}
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
          {canCancelTask(task, walletAddress) && (
            <ActionButton
              appearance={{ theme: 'secondary', size: 'small' }}
              button={ConfirmButton}
              confirmText={MSG.confirmText}
              onConfirmToggled={setDiscardConfirmDisplay}
              text={MSG.discardTask}
              submit={ACTIONS.TASK_CANCEL}
              error={ACTIONS.TASK_CANCEL_ERROR}
              success={ACTIONS.TASK_CANCEL_SUCCESS}
              values={setActionButtonValues}
            />
          )}
          {/* Hide when discard confirm is displayed */}
          {!isDiscardConfirmDisplayed && (
            <>
              {canFinalizeTask(task, walletAddress) && (
                <ActionButton
                  text={MSG.finalizeTask}
                  submit={ACTIONS.TASK_FINALIZE}
                  error={ACTIONS.TASK_FINALIZE_ERROR}
                  success={ACTIONS.TASK_FINALIZE_SUCCESS}
                  values={setActionButtonValues}
                />
              )}
              {isFinalized(task) && (
                <p className={styles.completedDescription}>
                  <FormattedMessage {...MSG.completed} />
                </p>
              )}
            </>
          )}
          {!isTaskCreator && (
            <TaskRequestWork currentUser={currentUser} task={task} />
          )}
          {/*
            Use these components for the full on-chain task workflow
            <TaskRatingButtons task={task} />
            <TaskClaimReward task={task} />
          */}
        </section>
        <div className={styles.activityContainer}>
          <section className={styles.activity}>
            <TaskFeed draftId={draftId} />
          </section>
          <section className={styles.commentBox}>
            <TaskComments
              draftId={draftId}
              taskTitle={title}
              currentUser={currentUser}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

Task.displayName = displayName;

export default withDialog()(Task);
