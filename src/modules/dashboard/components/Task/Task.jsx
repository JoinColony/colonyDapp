/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './Task.css';

import Form from '~core/Fields/Form';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Assignment from '~core/Assignment';

/*
 * @TODO Temporary, please remove when wiring in the rating modals
 */
import type { OpenDialog } from '~core/Dialog/types';

import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskComments from '~dashboard/TaskComments';
import TaskFeed from '~dashboard/TaskFeed';
import TaskClaimReward from '~dashboard/TaskClaimReward';

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
    defaultMessage: 'Go to {colonyName}',
  },
  completed: {
    id: 'dashboard.Task.completed',
    defaultMessage: 'Task completed',
  },
});

type Props = {
  openDialog: OpenDialog,
  task: Object,
  taskReward: Object,
  user: Object,
  isTaskCreator?: boolean,
  preventEdit?: boolean,
  userClaimedProfile?: boolean,
};

const displayName = 'dashboard.Task';

const Task = ({
  openDialog,
  task,
  taskReward,
  user,
  isTaskCreator = false,
  preventEdit = true,
  userClaimedProfile = false,
}: Props) => (
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
              onClick={() => openDialog('TaskEditDialog', {})}
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
          <Assignment
            assignee={task.assignee}
            reputation={task.reputation}
            payouts={task.payouts}
            nativeToken="CLNY"
          />
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
          <TaskSkills isTaskCreator={preventEdit} />
        </div>
        <div className={styles.editor}>
          <TaskDate isTaskCreator={preventEdit} />
        </div>
      </section>
    </aside>
    <div className={styles.container}>
      <section className={styles.header}>
        {task && !task.finalized ? (
          <Fragment>
            <TaskRequestWork
              isTaskCreator={isTaskCreator}
              claimedProfile={userClaimedProfile}
            />
            {/*
              * @TODO This should only be shown, if we're a worker, and the task
              * has a reward and was finalized (due date passed or work was submitted and rated)
              */}
            <TaskClaimReward taskReward={taskReward} taskTitle={task.title} />
            {/*
             * @TODO This are temporary buttons to be able to show the rating
             * modals until they will get wired up.
             */}
            <Button
              text="Rate Manager"
              onClick={() =>
                openDialog('ManagerRatingDialog', {
                  workSubmitted: false,
                })
              }
            />
            <Button
              text="Rate Manager (Work Submitted)"
              onClick={() =>
                openDialog('ManagerRatingDialog', { workSubmitted: true })
              }
            />
            <Button
              text="Rate Worker"
              onClick={() =>
                openDialog('WorkerRatingDialog', { workSubmitted: false })
              }
            />
            <Button
              text="Rate Worker (Work Submitted)"
              onClick={() =>
                openDialog('WorkerRatingDialog', { workSubmitted: true })
              }
            />
          </Fragment>
        ) : (
          <Fragment>
            {!task.payoutClaimed ? (
              /*
               * @NOTE This is a placeholder until #559 gets merged
               */
              <Button text="Claim Rewards" />
            ) : (
              <p className={styles.completedDescription}>
                <FormattedMessage {...MSG.completed} />
              </p>
            )}
          </Fragment>
        )}
      </section>
      <div className={styles.activityContainer}>
        <section className={styles.activity}>
          <TaskFeed feedItems={task.feedItems} currentUser={user} />
        </section>
        <section className={styles.commentBox}>
          <TaskComments claimedProfile={userClaimedProfile} />
        </section>
      </div>
    </div>
  </div>
);

Task.displayName = displayName;

export default Task;
