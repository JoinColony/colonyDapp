/* @flow */

import type { Match } from 'react-router';

// $FlowFixMe
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';

import { ACTIONS } from '~redux';
import { useDataFetcher, useSelector } from '~utils/hooks';

/*
 * TODO Temporary, please remove when wiring in the rating modals
 */
import type { OpenDialog } from '~core/Dialog/types';
import type { TaskType } from '~immutable';

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
  canBeCancelled,
  canRequestToWork,
  isActive,
  isCreator,
  isFinalized,
  isManager,
  taskCanBeEdited,
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

const openTaskEditDialog = ({
  openDialog,
  task: { worker, payouts, reputation },
}: {|
  openDialog: OpenDialog,
  task: TaskType,
|}) => {
  // TODO use props
  const tokens = [];
  const users = [];

  openDialog('TaskEditDialog', {
    availableTokens: tokens,
    maxTokens: 2,
    payouts: payouts.map(payout => ({
      token:
        // we add 1 because Formik thinks 0 is empty
        tokens.indexOf(
          tokens.find(token => token.symbol === payout.token.symbol),
        ) + 1,
      amount: payout.amount,
      id: nanoid(),
    })),
    reputation,
    users,
    worker,
  });
};

const displayName = 'dashboard.Task';

const Task = ({
  match: {
    params: { draftId, ensName },
  },
  openDialog,
}: Props) => {
  const [isDiscardConfirmDisplayed, setDiscardConfirmDisplay] = useState(false);

  const currentUser = useSelector(currentUserSelector);
  const { walletAddress: address } = currentUser.profile;

  const { data: task, isFetching, error } = useDataFetcher<TaskType>(
    taskFetcher,
    [draftId],
    [ensName, draftId],
  );

  if (!task || isFetching || error)
    return <LoadingTemplate loadingText={MSG.loadingText} />;

  const isTaskCreator = isCreator(task, address);

  const {
    description,
    domainId,
    dueDate,
    payouts,
    reputation,
    skillId,
    title,
    worker,
  } = task;

  const setActionButtonValues = () => ({ colonyENSName: ensName, draftId });

  return (
    <div className={styles.main}>
      <aside className={styles.sidebar}>
        <section className={styles.section}>
          <header className={styles.headerAside}>
            <Heading
              appearance={{ size: 'normal' }}
              text={MSG.assignmentFunding}
            />
            {!taskCanBeEdited(task, address) && (
              <Button
                appearance={{ theme: 'blue' }}
                text={MSG.details}
                onClick={() =>
                  openTaskEditDialog({
                    openDialog,
                    task,
                  })
                }
              />
            )}
          </header>
          <TaskAssignment
            colonyENSName={ensName}
            draftId={draftId}
            payouts={payouts}
            reputation={reputation}
            worker={worker}
          />
        </section>
        <section className={styles.section}>
          <TaskTitle
            colonyENSName={ensName}
            draftId={draftId}
            isTaskCreator={isTaskCreator}
            title={title}
          />
          <TaskDescription
            colonyENSName={ensName}
            description={description}
            draftId={draftId}
            isTaskCreator={isTaskCreator}
          />
        </section>
        <section className={styles.section}>
          <div className={styles.editor}>
            <TaskDomains
              colonyENSName={ensName}
              domainId={domainId}
              draftId={draftId}
              isTaskCreator={isTaskCreator}
            />
          </div>
          <div className={styles.editor}>
            <TaskSkills
              colonyENSName={ensName}
              draftId={draftId}
              isTaskCreator={isTaskCreator}
              skillId={skillId}
            />
          </div>
          <div className={styles.editor}>
            <TaskDate
              colonyENSName={ensName}
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
          {canBeCancelled(task, address) && (
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
              {/* Work has been submitted TODO is this check correct? */}
              {isManager(task, address) && isActive(task) && (
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
          {/* Apply to work/display "submitted" if already done */}
          {canRequestToWork(task, address) && (
            <TaskRequestWork currentUser={currentUser} task={task} />
          )}
          {/*
            TODO use these components for the full on-chain task workflow
            <TaskRatingButtons task={task} />
            <TaskClaimReward task={task} />
          */}
        </section>
        <div className={styles.activityContainer}>
          <section className={styles.activity}>
            {/* TODO in #580 define relevant props for TaskFeed */}
            <TaskFeed currentUser={currentUser} />
          </section>
          <section className={styles.commentBox}>
            {/* TODO in #580 define relevant props for TaskComments */}
            <TaskComments draftId={draftId} currentUser={currentUser} />
          </section>
        </div>
      </div>
    </div>
  );
};

Task.displayName = displayName;

export default withDialog()(Task);
