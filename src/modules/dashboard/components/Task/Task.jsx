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

import userMocks from './__datamocks__/mockUsers';
import userMock from '~user/AvatarDropdown/__datamocks__/mockUser';
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
  closeTask: {
    id: 'dashboard.Task.closeTask',
    defaultMessage: 'Close Task',
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
  domain: {
    id: 'dashboard.Task.domain',
    defaultMessage: 'Domain',
  },
  skill: {
    id: 'dashboard.Task.skill',
    defaultMessage: 'Skill',
  },
  dueDate: {
    id: 'dashboard.Task.dueDate',
    defaultMessage: 'Due Date',
  },
  requestToWork: {
    id: 'dashboard.Task.requestToWork',
    defaultMessage: 'Request To Work',
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
    <div>
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
            <Form
              onSubmit={console.log}
              initialValues={{
                assignee: '',
              }}
            >
              <SingleUserPicker
                name="assignee"
                itemComponent={ItemDefault}
                data={userMocks}
                filter={filter}
              />
            </Form>
          </section>
          <section className={styles.section}>
            {/* //TODO: replace this with TaskDescription
            component colonyDapp#439 */}
            <Form
              onSubmit={console.log}
              initialValues={{
                taskTitle: '',
                taskDescription: '',
              }}
            >
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
              {/* //TODO: Add domain colonyDapp#408 */}
              <Heading appearance={{ size: 'small' }} text={MSG.domain} />
              {isTaskCreator && (
                <Button
                  appearance={{ theme: 'blue', size: 'small' }}
                  text={MSG.add}
                />
              )}
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
              <TaskDate isTaskCreator />
            </div>
          </section>
        </aside>
        <div className={styles.container}>
          <section className={styles.header}>
            {isTaskCreator ? (
              <Button appearance={{ theme: 'primary' }} text={MSG.closeTask} />
            ) : (
              <Button
                appearance={{ theme: 'primary' }}
                text={MSG.requestToWork}
              />
            )}
          </section>
          {/* //TODO: replace this with task comments component
            component in colonyDapp#440 */}
          <section className={styles.activityContainer} />
        </div>
      </div>
    </div>
  );
};

Task.displayName = displayName;

export default Task;
