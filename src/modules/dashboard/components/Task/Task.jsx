/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';

import styles from './Task.css';

import Form from '~core/Fields/Form';
import Heading from '~core/Heading';
import Button, { ActionButton, DialogActionButton } from '~core/Button';

/*
 * @TODO Temporary, please remove when wiring in the rating modals
 */
import type { OpenDialog } from '~core/Dialog/types';
import type { TaskRecord, UserRecord } from '~immutable';

import TaskAssignment from '~dashboard/TaskAssignment';
import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskComments from '~dashboard/TaskComments';
import TaskFeed from '~dashboard/TaskFeed';
import TaskClaimReward from '~dashboard/TaskClaimReward';
import TaskSkills from '~dashboard/TaskSkills';

import { TASK_STATE, UserProfile } from '~immutable';

import {
  TASK_WORKER_END,
  TASK_WORKER_END_ERROR,
  TASK_WORKER_END_SUCCESS,
  TASK_MANAGER_END,
  TASK_MANAGER_END_ERROR,
  TASK_MANAGER_END_SUCCESS,
  TASK_WORKER_RATE_MANAGER,
  TASK_WORKER_RATE_MANAGER_ERROR,
  TASK_WORKER_RATE_MANAGER_SUCCESS,
  TASK_MANAGER_RATE_WORKER,
  TASK_MANAGER_RATE_WORKER_ERROR,
  TASK_MANAGER_RATE_WORKER_SUCCESS,
  TASK_MANAGER_REVEAL_WORKER_RATING,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
  TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
  TASK_WORKER_REVEAL_MANAGER_RATING,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
  TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
  TASK_FINALIZE,
  TASK_FINALIZE_ERROR,
  TASK_FINALIZE_SUCCESS,
} from '../../actionTypes';

import userMocks from './__datamocks__/mockUsers';
import tokensMock from '../../../../__mocks__/mockTokens';

const MSG = defineMessages({
  assignmentFunding: {
    id: 'dashboard.Task.assignmentFunding',
    defaultMessage: 'Assignment and Funding',
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
  submitWork: {
    id: 'dashboard.Task.submitWork',
    defaultMessage: 'Submit Work',
  },
  rateWorker: {
    id: 'dashboard.Task.rateWorker',
    defaultMessage: 'Rate Worker',
  },
  rateManager: {
    id: 'dashboard.Task.rateManager',
    defaultMessage: 'Rate Manager',
  },
  revealRating: {
    id: 'dashboard.Task.revealRating',
    defaultMessage: 'Reveal Rating',
  },
  finalizeTask: {
    id: 'dashboard.Task.finalizeTask',
    defaultMessage: 'Finalize Task',
  },
});

type Props = {
  openDialog: OpenDialog,
  task: TaskRecord,
  currentUser: UserRecord,
  isTaskCreator?: boolean,
  preventEdit: boolean,
};

class Task extends Component<Props> {
  static displayName = 'dashboard.Task';

  static defaultProps = {
    isTaskCreator: false,
    preventEdit: true,
    currentUser: UserProfile(),
  };

  openTaskEditDialog = () => {
    const { openDialog, task } = this.props;
    const payouts = task.payouts.map(payout => ({
      token:
        // we add 1 because Formik thinks 0 is empty
        tokensMock.indexOf(
          tokensMock.find(token => token.symbol === payout.token.symbol),
        ) + 1,
      amount: payout.amount,
      id: nanoid(),
    }));

    openDialog('TaskEditDialog', {
      assignee: task.assignee,
      availableTokens: tokensMock,
      maxTokens: 2,
      payouts,
      reputation: task.reputation,
      users: userMocks,
    });
  };

  setValues = (dialogValues?: Object = {}) => {
    const {
      task: { colonyENSName, draftId },
    } = this.props;
    return {
      ...dialogValues,
      colonyENSName,
      draftId,
    };
  };

  get isWorker() {
    const {
      task: { assignee },
      currentUser,
    } = this.props;
    return (
      !!assignee &&
      assignee.profile.walletAddress.toLowerCase() ===
        currentUser.profile.walletAddress.toLowerCase()
    );
  }

  get isManager() {
    const {
      task: { creator },
      currentUser,
    } = this.props;
    return (
      creator.toLowerCase() === currentUser.profile.walletAddress.toLowerCase()
    );
  }

  get dueDatePassed() {
    const {
      task: { dueDate },
    } = this.props;
    return !!dueDate && dueDate < new Date();
  }

  get canClaimPayout() {
    const {
      task: { currentState, workerPayoutClaimed, managerPayoutClaimed },
    } = this.props;
    return (
      currentState === TASK_STATE.FINALIZED &&
      ((this.isWorker && !workerPayoutClaimed) ||
        (this.isManager && !managerPayoutClaimed))
    );
  }

  get canBeFinalized() {
    const {
      task: { currentState, managerRating, workerRating },
    } = this.props;
    return (
      currentState === TASK_STATE.REVEAL && !!managerRating && !!workerRating
    );
  }

  render() {
    const { isTaskCreator, preventEdit, task, currentUser } = this.props;
    const {
      setValues,
      isWorker,
      isManager,
      dueDatePassed,
      canClaimPayout,
      canBeFinalized,
    } = this;
    return (
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <section className={styles.section}>
            <header className={styles.headerAside}>
              <Heading
                appearance={{ size: 'normal' }}
                text={MSG.assignmentFunding}
              />
              {preventEdit && (
                <Button
                  appearance={{ theme: 'blue' }}
                  text={MSG.details}
                  onClick={this.openTaskEditDialog}
                />
              )}
            </header>
            <Form
              /* eslint-disable-next-line no-console */
              onSubmit={console.log}
            >
              {/*
               * TODO: replace this with TaskAssignment component in colonyDapp#445
               *
               * This should also add in a `readOnly` prop for the `SingleUserPicker`
               * to prevent opening when the task has been finalized.
               *
               * See:
               * https://github.com/JoinColony/colonyDapp/pull/460#issuecomment-437870446
               */}
              <TaskAssignment task={task} nativeToken="CLNY" />
            </Form>
          </section>
          <section className={styles.section}>
            <Form
              /* eslint-disable-next-line no-console */
              onSubmit={console.log}
              initialValues={{
                taskTitle: task.title,
              }}
            >
              <TaskDescription isTaskCreator={preventEdit} />
            </Form>
          </section>
          <section className={styles.section}>
            <div className={styles.editor}>
              <TaskDomains isTaskCreator={preventEdit} />
            </div>
            <div className={styles.editor}>
              <TaskSkills isTaskCreator={preventEdit} task={task} />
            </div>
            <div className={styles.editor}>
              <TaskDate isTaskCreator task={task} />
            </div>
          </section>
        </aside>
        <div className={styles.container}>
          <section className={styles.header}>
            {/* Work has been submitted and rating have been given  */}
            {canBeFinalized && (
              <ActionButton
                text={MSG.finalizeTask}
                submit={TASK_FINALIZE}
                success={TASK_FINALIZE_SUCCESS}
                error={TASK_FINALIZE_ERROR}
                setValues={setValues}
              />
            )}
            <TaskRequestWork
              isTaskCreator={isTaskCreator}
              currentUser={currentUser}
            />
            {/* Worker misses deadline and rates manager */}
            {task.currentState === TASK_STATE.RATING &&
              isWorker &&
              !task.workerHasRated && (
                <DialogActionButton
                  dialog="ManagerRatingDialog"
                  dialogProps={{
                    submitWork: false,
                  }}
                  text={MSG.rateManager}
                  submit={TASK_WORKER_RATE_MANAGER}
                  success={TASK_WORKER_RATE_MANAGER_SUCCESS}
                  error={TASK_WORKER_RATE_MANAGER_ERROR}
                  values={setValues}
                />
              )}
            {/* Worker submits work, ends task + rates before deadline */}
            {task.currentState !== TASK_STATE.RATING &&
              isWorker &&
              !dueDatePassed && (
                <DialogActionButton
                  dialog="ManagerRatingDialog"
                  dialogProps={{
                    submitWork: true,
                  }}
                  text={MSG.submitWork}
                  submit={TASK_WORKER_END}
                  success={TASK_WORKER_END_SUCCESS}
                  error={TASK_WORKER_END_ERROR}
                  values={setValues}
                />
              )}
            {/* Worker misses deadline and manager ends task + rates */}
            {task.currentState !== TASK_STATE.RATING &&
              isManager &&
              dueDatePassed && (
                <DialogActionButton
                  dialog="WorkerRatingDialog"
                  options={{
                    workSubmitted: false,
                  }}
                  text={MSG.rateWorker}
                  submit={TASK_MANAGER_END}
                  success={TASK_MANAGER_END_SUCCESS}
                  error={TASK_MANAGER_END_ERROR}
                  values={setValues}
                />
              )}
            {/* Worker makes deadline and manager rates worker */}
            {task.currentState === TASK_STATE.RATING && isManager && (
              <DialogActionButton
                dialog="WorkerRatingDialog"
                options={{
                  workSubmitted: true,
                }}
                text={MSG.rateWorker}
                submit={TASK_MANAGER_RATE_WORKER}
                success={TASK_MANAGER_RATE_WORKER_SUCCESS}
                error={TASK_MANAGER_RATE_WORKER_ERROR}
                values={setValues}
              />
            )}
            {/* Manager reveal rating of worker */}
            {task.currentState === TASK_STATE.REVEAL && isManager && (
              <ActionButton
                text={MSG.revealRating}
                submit={TASK_MANAGER_REVEAL_WORKER_RATING}
                success={TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS}
                error={TASK_MANAGER_REVEAL_WORKER_RATING_ERROR}
                values={setValues}
              />
            )}
            {/* Worker reveal rating of manager */}
            {task.currentState === TASK_STATE.REVEAL && isWorker && (
              <ActionButton
                text={MSG.revealRating}
                submit={TASK_WORKER_REVEAL_MANAGER_RATING}
                success={TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS}
                error={TASK_WORKER_REVEAL_MANAGER_RATING_ERROR}
                values={setValues}
              />
            )}
            {/* Task is finalized and payouts can be claimed */}
            {canClaimPayout && <TaskClaimReward task={task} />}
            {/* Task is finalized and no payouts can be claimed */}
            {task.currentState === TASK_STATE.FINALIZED && !canClaimPayout && (
              <p className={styles.completedDescription}>
                <FormattedMessage {...MSG.completed} />
              </p>
            )}
          </section>
          <div className={styles.activityContainer}>
            <section className={styles.activity}>
              <TaskFeed
                feedItems={task.feedItems}
                currentUser={currentUser}
                isRevealEnded={task.currentState === TASK_STATE.FINALIZED}
              />
            </section>
            <section className={styles.commentBox}>
              <TaskComments
                draftId={task.draftId}
                currentUser={currentUser}
              />
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default Task;
