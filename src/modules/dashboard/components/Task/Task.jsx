/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';

import { ACTIONS } from '~redux';
import { TASK_STATE } from '~immutable';

/*
 * @TODO Temporary, please remove when wiring in the rating modals
 */
import type { OpenDialog } from '~core/Dialog/types';
import type { TaskType, UserType } from '~immutable';

import Form from '~core/Fields/Form';
import Heading from '~core/Heading';
import Button, { ActionButton, DialogActionButton } from '~core/Button';

import TaskAssignment from '~dashboard/TaskAssignment';
import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskComments from '~dashboard/TaskComments';
import TaskFeed from '~dashboard/TaskFeed';
import TaskClaimReward from '~dashboard/TaskClaimReward';
import TaskSkills from '~dashboard/TaskSkills';

import userMocks from './__datamocks__/mockUsers';
import tokensMock from '../../../../__mocks__/mockTokens';

import styles from './Task.css';

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

type Props = {|
  canTaskBeFinalized: boolean,
  canTaskPayoutBeClaimed: boolean,
  currentUser: UserType,
  didTaskDueDateElapse: boolean,
  isTaskCreator?: boolean,
  isTaskManager: boolean,
  isTaskWorker: boolean,
  openDialog: OpenDialog,
  preventEdit: boolean,
  task: TaskType,
|};

class Task extends Component<Props> {
  static displayName = 'dashboard.Task';

  static defaultProps = {
    isTaskCreator: false,
    preventEdit: true,
    currentUser: {},
  };

  openTaskEditDialog = () => {
    const {
      openDialog,
      task: { worker, payouts, reputation },
    } = this.props;

    openDialog('TaskEditDialog', {
      availableTokens: tokensMock,
      maxTokens: 2,
      payouts: payouts.map(payout => ({
        token:
          // we add 1 because Formik thinks 0 is empty
          tokensMock.indexOf(
            tokensMock.find(token => token.symbol === payout.token.symbol),
          ) + 1,
        amount: payout.amount,
        id: nanoid(),
      })),
      reputation,
      users: userMocks,
      worker,
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

  render() {
    const {
      props: {
        canTaskBeFinalized,
        canTaskPayoutBeClaimed,
        currentUser,
        didTaskDueDateElapse,
        isTaskCreator,
        isTaskManager,
        isTaskWorker,
        preventEdit,
        task: { worker },
        task,
      },
      setValues,
    } = this;
    // TODO: this should be determined from Colony in state
    const hasRequestedToWork = true;
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
              <TaskDomains isTaskCreator={preventEdit} draftId={task.draftId} />
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
            {canTaskBeFinalized && (
              <ActionButton
                text={MSG.finalizeTask}
                submit={ACTIONS.TASK_FINALIZE}
                success={ACTIONS.TASK_FINALIZE_SUCCESS}
                error={ACTIONS.TASK_FINALIZE_ERROR}
                setValues={setValues}
              />
            )}
            {/* Apply to work/display "submitted" if already done */}
            {!worker && !isTaskCreator && (
              <TaskRequestWork
                currentUser={currentUser}
                task={task}
                hasRequested={hasRequestedToWork}
              />
            )}
            {/* Worker misses deadline and rates manager */}
            {task.currentState === TASK_STATE.RATING &&
              isTaskWorker &&
              !(worker && worker.didRate) && (
                <DialogActionButton
                  dialog="ManagerRatingDialog"
                  dialogProps={{
                    submitWork: false,
                  }}
                  text={MSG.rateManager}
                  submit={ACTIONS.TASK_WORKER_RATE_MANAGER}
                  success={ACTIONS.TASK_WORKER_RATE_MANAGER_SUCCESS}
                  error={ACTIONS.TASK_WORKER_RATE_MANAGER_ERROR}
                  values={setValues}
                />
              )}
            {/* Worker submits work, ends task + rates before deadline */}
            {task.currentState !== TASK_STATE.RATING &&
              isTaskWorker &&
              !didTaskDueDateElapse && (
                <DialogActionButton
                  dialog="ManagerRatingDialog"
                  dialogProps={{
                    submitWork: true,
                  }}
                  text={MSG.submitWork}
                  submit={ACTIONS.TASK_WORKER_END}
                  success={ACTIONS.TASK_WORKER_END_SUCCESS}
                  error={ACTIONS.TASK_WORKER_END_ERROR}
                  values={setValues}
                />
              )}
            {/* Worker misses deadline and manager ends task + rates */}
            {task.currentState !== TASK_STATE.RATING &&
              isTaskManager &&
              didTaskDueDateElapse && (
                <DialogActionButton
                  dialog="WorkerRatingDialog"
                  options={{
                    workSubmitted: false,
                  }}
                  text={MSG.rateWorker}
                  submit={ACTIONS.TASK_MANAGER_END}
                  success={ACTIONS.TASK_MANAGER_END_SUCCESS}
                  error={ACTIONS.TASK_MANAGER_END_ERROR}
                  values={setValues}
                />
              )}
            {/* Worker makes deadline and manager rates worker */}
            {task.currentState === TASK_STATE.RATING && isTaskManager && (
              <DialogActionButton
                dialog="WorkerRatingDialog"
                options={{
                  workSubmitted: true,
                }}
                text={MSG.rateWorker}
                submit={ACTIONS.TASK_MANAGER_RATE_WORKER}
                success={ACTIONS.TASK_MANAGER_RATE_WORKER_SUCCESS}
                error={ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR}
                values={setValues}
              />
            )}
            {/* Manager reveal rating of worker */}
            {task.currentState === TASK_STATE.REVEAL && isTaskManager && (
              <ActionButton
                text={MSG.revealRating}
                submit={ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING}
                success={ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS}
                error={ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR}
                values={setValues}
              />
            )}
            {/* Worker reveal rating of manager */}
            {task.currentState === TASK_STATE.REVEAL && isTaskWorker && (
              <ActionButton
                text={MSG.revealRating}
                submit={ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING}
                success={ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS}
                error={ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR}
                values={setValues}
              />
            )}
            {/* Task is finalized and payouts can be claimed */}
            {canTaskPayoutBeClaimed && <TaskClaimReward task={task} />}
            {/* Task is finalized and no payouts can be claimed */}
            {task.currentState === TASK_STATE.FINALIZED &&
              !canTaskPayoutBeClaimed && (
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
              <TaskComments draftId={task.draftId} currentUser={currentUser} />
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default Task;
