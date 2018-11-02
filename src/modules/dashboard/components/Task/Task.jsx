/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import styles from './Task.css';

import Input from '~core/Fields/Input';
import Form from '~core/Fields/Form';
import Heading from '~core/Heading';
import Button from '~core/Button';
import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';

import TaskDate from '~dashboard/TaskDate';
import TaskDomains from '~dashboard/TaskDomains';
import TaskRequestWork from '~dashboard/TaskRequestWork';

import userMocks from './__datamocks__/mockUsers';
import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';
import taskMock from './__datamocks__/mockTask';

const displayName = 'dashboard.Task';

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
  taskTitle: {
    id: 'dashboard.Task.taskTitle',
    defaultMessage: 'Task Title',
  },
  taskDescription: {
    id: 'dashboard.Task.taskDescription',
    defaultMessage: 'Task Description',
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

const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );

const Task = () => {
  const isTaskCreator =
    taskMock.creator.toLowerCase() === userMock.walletAddress.toLowerCase();

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
          {/* //TODO: replace this with TaskAssignment
          component in colonyDapp#445 */}
          <div className={styles.section}>
            <Form
              /* eslint-disable-next-line no-console */
              onSubmit={console.log}
            >
              <SingleUserPicker
                name="assignee"
                itemComponent={ItemDefault}
                data={userMocks}
                filter={filter}
              />
            </Form>
          </div>
        </section>
        <section className={styles.section}>
          <Form
            /* eslint-disable-next-line no-console */
            onSubmit={console.log}
          >
            {/* //TODO: replace this with TaskDescription
            component colonyDapp#439 */}
            <Input
              appearance={{ theme: 'dotted', colorSchema: 'grey' }}
              name="taskDescription"
              placeholder={MSG.taskTitle}
            />
            <Input
              appearance={{
                theme: 'dotted',
                colorSchema: 'grey',
                size: 'small',
              }}
              name="taskTitle"
              placeholder={MSG.taskDescription}
            />
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
        </section>
        <div className={styles.activityContainer}>
          <section className={styles.activity}>
            Task comment activity placeholder
          </section>
          <section className={styles.commentBox}>
            Comment box placeholder
          </section>
        </div>
      </div>
    </div>
  );
};

Task.displayName = displayName;

export default Task;
