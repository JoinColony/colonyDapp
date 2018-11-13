/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import styles from './Task.css';

import Form from '~core/Fields/Form';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Assignment from '~core/Assignment';

/*
 * @TODO Temporary, please remove when wiring in the rating modals
 */
import type { DialogType } from '~core/Dialog';
import withDialog from '~core/Dialog/withDialog';

import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
import TaskDomains from '~dashboard/TaskDomains';
import TaskRequestWork from '~dashboard/TaskRequestWork';
import TaskComments from '~dashboard/TaskComments';
import TaskFeed from '~dashboard/TaskFeed';

import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';
import { mockTask, mockTaskReward } from './__datamocks__/mockTask';

const displayName = 'dashboard.Task';

type Props = {
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
};

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
  add: {
    id: 'dashboard.Task.add',
    defaultMessage: 'Add +',
  },
  skill: {
    id: 'dashboard.Task.skill',
    defaultMessage: 'Skill',
  },
});

const Task = ({ openDialog }: Props) => {
  const isTaskCreator =
    mockTask.creator.toLowerCase() === userMock.walletAddress.toLowerCase();

  return (
    <div className={styles.main}>
      <aside className={styles.sidebar}>
        <section className={styles.section}>
          <header className={styles.headerAside}>
            <Heading
              appearance={{ size: 'normal' }}
              text={MSG.assignmentFunding}
            />
            {isTaskCreator && (
              <Button appearance={{ theme: 'blue' }} text={MSG.details} />
            )}
          </header>
          <Form
            /* eslint-disable-next-line no-console */
            onSubmit={console.log}
          >
            <Assignment
              assignee={taskMock.assignee}
              reputation={taskMock.reputation}
              payouts={taskMock.payouts}
              nativeToken="CLNY"
            />
          </Form>
        </section>
        <section className={styles.section}>
          <Form
            /* eslint-disable-next-line no-console */
            onSubmit={console.log}
          >
            <TaskDescription isTaskCreator={isTaskCreator} />
          </Form>
        </section>
        <section className={styles.section}>
          <div className={styles.editor}>
            <TaskDomains isTaskCreator={isTaskCreator} />
          </div>
          <div className={styles.editor}>
            <Heading appearance={{ size: 'small' }} text={MSG.skill} />
            {isTaskCreator && (
              <Button
                appearance={{ theme: 'blue', size: 'small' }}
                text={MSG.add}
              />
            )}
          </div>
          <div className={styles.editor}>
            <TaskDate isTaskCreator={isTaskCreator} />
          </div>
        </section>
      </aside>
      <div className={styles.container}>
        <section className={styles.header}>
          <TaskRequestWork isTaskCreator={isTaskCreator} />
          {/*
           * @TODO This should only be shown, if we're a worker, and the task
           * has a reward and was finalized (due date passed or work was submitted and rated)
           */}
          <TaskClaimReward taskReward={mockTaskReward} />
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
        </section>
        <div className={styles.activityContainer}>
          <section className={styles.activity}>
            <TaskFeed feedItems={taskMock.feedItems} currentUser={userMock} />
          </section>
          <section className={styles.commentBox}>
            <TaskComments />
          </section>
        </div>
      </div>
    </div>
  );
};

Task.displayName = displayName;

export default withDialog()(Task);
