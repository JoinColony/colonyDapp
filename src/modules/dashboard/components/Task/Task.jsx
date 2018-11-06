/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import styles from './Task.css';

import Form from '~core/Fields/Form';
import FormStatus from '~core/Fields/FormStatus';
import Heading from '~core/Heading';
import Button from '~core/Button';
import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';

import TaskDate from '~dashboard/TaskDate';
import TaskDescription from '~dashboard/TaskDescription';
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
    <div>
      <Form
        /* eslint-disable-next-line no-console */
        onSubmit={console.log}
        initialValues={{
          taskName: '',
        }}
      >
        {({ status }) => (
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
                  <SingleUserPicker
                    name="assignee"
                    itemComponent={ItemDefault}
                    data={userMocks}
                    filter={filter}
                  />
                </div>
              </section>
              <section className={styles.section}>
                <TaskDescription isTaskCreator={isTaskCreator} />
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
              {/* //TODO: replace this with task comments component
                component in colonyDapp#440 */}
              <section className={styles.activityContainer} />
            </div>
            <FormStatus status={status} />
          </div>
        )}
      </Form>
    </div>
  );
};

Task.displayName = displayName;

export default Task;
