/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import { Formik } from 'formik';

import styles from './TaskCreation.css';

import Input from '~core/Fields/Input';
import Icon from '~core/Icon';
import Navigation from '~dashboard/Navigation';
import AvatarDropdown from '~dashboard/AvatarDropdown';
import NavLink from '~core/NavLink';
import Heading from '~core/Heading';
import Button from '~core/Button';
import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';

import userMocks from './__datamocks__/mockUsers';
import userMock from './__datamocks__/mockUser';
import taskMock from './__datamocks__/mockTask';

const MSG = defineMessages({
  assignmentFunding: {
    id: 'dashboard.TaskCreation.assignmentFunding',
    defaultMessage: 'Assignment and Funding',
  },
  details: {
    id: 'dashboard.TaskCreation.details',
    defaultMessage: 'Details',
  },
  closeTask: {
    id: 'dashboard.TaskCreation.closeTask',
    defaultMessage: 'Close Task',
  },
  backButton: {
    id: 'dashboard.TaskCreation.backButton',
    defaultMessage: 'Go to {colonyName}',
  },
  taskTitle: {
    id: 'dashboard.TaskCreation.taskTitle',
    defaultMessage: 'Task Title',
  },
  taskDescription: {
    id: 'dashboard.TaskCreation.taskDescription',
    defaultMessage: 'Task Description',
  },
  add: {
    id: 'dashboard.TaskCreation.add',
    defaultMessage: 'Add +',
  },
  domain: {
    id: 'dashboard.TaskCreation.domain',
    defaultMessage: 'Domain',
  },
  skill: {
    id: 'dashboard.TaskCreation.skill',
    defaultMessage: 'Skill',
  },
  dueDate: {
    id: 'dashboard.TaskCreation.dueDate',
    defaultMessage: 'Due Date',
  },
  requestToWork: {
    id: 'dashboard.TaskCreation.requestToWork',
    defaultMessage: 'Request To Work',
  },
});

type Props = {
  /*
   * The redux state will contain the current task details if there's any already
   * and the current user details
   *
   */
  colonyName?: string,
};

const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );

class TaskCreation extends Component<Props> {
  editDescription = () => {};

  render() {
    const isTaskCreator =
      taskMock.creator.toLowerCase() === userMock.walletAddress.toLowerCase();
    const { colonyName = 'The Meta Colony' } = this.props;

    return (
      <div>
        <div className={styles.navigation}>
          <div className={styles.backNavigation}>
            <Icon
              name="circle-back"
              title="back"
              appearance={{ size: 'medium' }}
            />
            <NavLink
              to="/colony"
              text={MSG.backButton}
              textValues={{ colonyName }}
            />
          </div>
          <div className={styles.mainNav}>
            <Navigation />
            <AvatarDropdown />
          </div>
        </div>
        <Formik
          onSubmit={console.log}
          initialValues={{
            taskName: '',
          }}
        >
          {({ handleSubmit }) => (
            <form className={styles.main} onSubmit={handleSubmit}>
              <aside className={styles.sidebar}>
                <section className={styles.section}>
                  <header className={styles.headerAside}>
                    <Heading
                      appearance={{ size: 'normal' }}
                      text={MSG.assignmentFunding}
                    />
                    {isTaskCreator && (
                      <Button
                        appearance={{ theme: 'blue' }}
                        text={MSG.details}
                      />
                    )}
                  </header>
                  {/* //TODO: replace this with TaskAssignment
                  component in colonyDapp#445 */}
                  <SingleUserPicker
                    name="assignee"
                    itemComponent={ItemDefault}
                    data={userMocks}
                    filter={filter}
                  />
                </section>
                <section className={styles.section}>
                  {/* //TODO: replace this with TaskDescription
                  component colonyDapp#439 */}
                  <Input
                    appearance={{ theme: 'dotted' }}
                    name="taskDescription"
                    placeholder={MSG.taskTitle}
                  />
                  <Input
                    appearance={{ theme: 'dotted' }}
                    name="taskTitle"
                    placeholder={MSG.taskDescription}
                  />
                </section>
                <section className={styles.section}>
                  <div className={styles.editor}>
                    {/* //TODO: Add domain colonyDapp#408 */}
                    <Heading
                      appearance={{ size: 'normal' }}
                      text={MSG.domain}
                    />
                    <Button
                      appearance={{ theme: 'blue' }}
                      text={MSG.add}
                      disabled={!isTaskCreator}
                    />
                  </div>
                  <div className={styles.editor}>
                    <Heading appearance={{ size: 'normal' }} text={MSG.skill} />
                    <Button
                      appearance={{ theme: 'blue' }}
                      text={MSG.add}
                      disabled={!isTaskCreator}
                    />
                  </div>
                  <div className={styles.editor}>
                    {/* //TODO: Add due date colonyDapp#410 */}
                    <Heading
                      appearance={{ size: 'normal' }}
                      text={MSG.dueDate}
                    />
                    <Button
                      appearance={{ theme: 'blue' }}
                      text={MSG.add}
                      disabled={!isTaskCreator}
                    />
                  </div>
                </section>
              </aside>
              <div className={styles.container}>
                <section className={styles.header}>
                  {isTaskCreator ? (
                    <Button
                      appearance={{ theme: 'primary' }}
                      text={MSG.closeTask}
                    />
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
            </form>
          )}
        </Formik>
      </div>
    );
  }
}

export default TaskCreation;
