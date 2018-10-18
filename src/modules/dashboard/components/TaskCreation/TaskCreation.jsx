/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { Formik } from 'formik';

import styles from './TaskCreation.css';

import Icon from '~core/Icon';
import Navigation from '~dashboard/Navigation';
import AvatarDropdown from '~dashboard/AvatarDropdown';
import NavLink from '~core/NavLink';
import Heading from '~core/Heading';
import Button from '~core/Button';
import SingleUserPicker, { ItemDefault } from '~core/SingleUserPicker';

import userMocks from './__datamocks__/mockUser';

// import CommentForm from '../CommentForm';

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
});

type Props = {
  /*
   * This will most likely come from the redux state
   * The most obvious way to achieve this is to enhance this component with
   * a connect call
   */
  colonyName?: string,
};

const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );

const TaskCreation = ({ colonyName = 'The Meta Colony' }: Props) => (
  <div className={styles.main} data-wd-hook="card-details">
    <div className={styles.navigation}>
      <div className={styles.backNavigation}>
        <Icon name="circle-back" title="back" appearance={{ size: 'medium' }} />
        <NavLink
          to="/colony"
          text={MSG.backButton}
          textValues={{ colonyName }}
        />
        <div className={styles.mainNav}>
          <Navigation />
          <AvatarDropdown />
        </div>
      </div>
    </div>
    <Formik
      onSubmit={console.log}
      initialValues={{
        taskName: '',
      }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          {/* <TaskCreationClosedMessage closed={task.closed} /> */}
          <aside className={styles.sidebar}>
            <header className={styles.headerAside}>
              <Heading
                appearance={{ size: 'medium' }}
                text={MSG.assignmentFunding}
              />
              <Button appearance={{ theme: 'blue' }} text={MSG.details} />
            </header>
            <section className={styles.section}>
              {/* //TODO: replace this with TaskAssignment component in colonyDapp#403 */}
              <SingleUserPicker
                name="assignee"
                itemComponent={ItemDefault}
                data={userMocks}
                filter={filter}
              />
            </section>
          </aside>
          <div className={styles.container}>
            <section className={styles.header}>
              <Button appearance={{ theme: 'primary' }} text={MSG.closeTask} />
            </section>
            <section className={styles.activityContainer} />
          </div>
        </form>
      )}
    </Formik>
  </div>
);

export default TaskCreation;
