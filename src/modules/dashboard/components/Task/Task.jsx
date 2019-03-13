/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';

import { ACTIONS } from '~redux';
import { TASK_STATE } from '~immutable';

/*
 * TODO Temporary, please remove when wiring in the rating modals
 */
import type { OpenDialog } from '~core/Dialog/types';
import type { TaskFeedItemType, TaskType, UserType } from '~immutable';

import Form from '~core/Fields/Form';
import Heading from '~core/Heading';
import Button, { ActionButton, ConfirmButton } from '~core/Button';

import TaskAssignment from '~dashboard/TaskAssignment';
import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskComments from '~dashboard/TaskComments';
import TaskFeed from '~dashboard/TaskFeed';
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
  finalizeTask: {
    id: 'dashboard.Task.finalizeTask',
    defaultMessage: 'Finalize Task',
  },
  discardTask: {
    id: 'dashboard.Task.discardTask',
    defaultMessage: 'Discard task',
  },
  confirmText: {
    id: 'dashboard.Task.confirmText',
    defaultMessage: 'Are you sure you want to discard this task?',
  },
});

type Props = {|
  canTaskBeFinalized: boolean,
  canTaskPayoutBeClaimed: boolean,
  currentUser: UserType,
  didTaskDueDateElapse: boolean,
  feedItems: TaskFeedItemType[],
  isTaskCreator?: boolean,
  isTaskManager: boolean,
  isTaskWorker: boolean,
  openDialog: OpenDialog,
  preventEdit: boolean,
  task: TaskType,
|};

type State = {|
  isDiscardConfirmDisplayed: boolean,
|};

class Task extends Component<Props, State> {
  static displayName = 'dashboard.Task';

  static defaultProps = {
    isTaskCreator: false,
    preventEdit: true,
    currentUser: {},
  };

  state = {
    isDiscardConfirmDisplayed: false,
  };

  openTaskEditDialog = () => {
    const {
      openDialog,
      task: { worker, payouts, reputation },
    } = this.props;

    openDialog('TaskEditDialog', {
      // TODO: this should be the Colony's tokens
      availableTokens: tokensMock.toJS(),
      maxTokens: 1,
      minTokens: 1,
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
      // TODO: this should be users who have requested to work
      users: userMocks.toJS(),
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

  handleDiscardConfirmToggled = (state: boolean) => {
    this.setState({ isDiscardConfirmDisplayed: state });
  };

  render() {
    const {
      props: {
        currentUser,
        feedItems,
        isTaskCreator,
        isTaskManager,
        preventEdit,
        task: { worker },
        task,
      },
      state: { isDiscardConfirmDisplayed },
      setValues,
      handleDiscardConfirmToggled,
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
              {!preventEdit && (
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
          <section
            className={`${styles.header} ${
              isDiscardConfirmDisplayed ? styles.headerConfirm : ''
            }`}
          >
            {/* Task can be canceled by current user */}
            {isTaskManager && task.currentState === TASK_STATE.ACTIVE && (
              <ActionButton
                appearance={{ theme: 'secondary', size: 'small' }}
                button={ConfirmButton}
                confirmText={MSG.confirmText}
                error={ACTIONS.TASK_CANCEL_ERROR}
                onConfirmToggled={handleDiscardConfirmToggled}
                submit={ACTIONS.TASK_CANCEL}
                success={ACTIONS.TASK_CANCEL_SUCCESS}
                text={MSG.discardTask}
                values={setValues}
              />
            )}
            {/* Hide when discard confirm is displayed */}
            {!isDiscardConfirmDisplayed && (
              <>
                {/* Apply to work/display "submitted" if already done */}
                {!worker && !isTaskCreator && (
                  <TaskRequestWork
                    currentUser={currentUser}
                    task={task}
                    hasRequested={hasRequestedToWork}
                  />
                )}
                {/* Work has been submitted  */}
                {isTaskManager && task.currentState === TASK_STATE.ACTIVE && (
                  <ActionButton
                    text={MSG.finalizeTask}
                    submit={ACTIONS.TASK_FINALIZE}
                    success={ACTIONS.TASK_FINALIZE_SUCCESS}
                    error={ACTIONS.TASK_FINALIZE_ERROR}
                    values={setValues}
                  />
                )}
                {/* Task is finalized/completed */}
                {task.currentState === TASK_STATE.FINALIZED && (
                  <p className={styles.completedDescription}>
                    <FormattedMessage {...MSG.completed} />
                  </p>
                )}
              </>
            )}
          </section>
          <div className={styles.activityContainer}>
            <section className={styles.activity}>
              <TaskFeed
                feedItems={feedItems}
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
