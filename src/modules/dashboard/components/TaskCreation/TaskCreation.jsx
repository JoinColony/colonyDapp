/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { Formik } from 'formik';

import styles from './TaskCreation.css';

import Icon from '~core/Icon';
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
});

const filter = (data, filterValue) =>
  data.filter(user =>
    user.username.toLowerCase().startsWith(filterValue.toLowerCase()),
  );

const TaskCreation = () => (
  <div className={styles.main} data-wd-hook="card-details">
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
              <div className={styles.headerIconContainer}>
                <Icon
                  data-wd-hook="close-card-details-modal"
                  className={styles.icon}
                  role="button"
                  name="circle-close"
                  size="medium"
                  onClick={close}
                />
              </div>
            </section>
            <section className={styles.activityContainer} />
          </div>
        </form>
      )}
    </Formik>
  </div>
);

export default TaskCreation;
