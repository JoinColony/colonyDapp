/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './TaskComments.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskComments.title',
    defaultMessage: 'Assignment and Funding',
  },
});

const displayName = 'dashboard.TaskComments';

const TaskComments = () => (
  <div className={styles.main}>
    <FormattedMessage {...MSG.title} />
  </div>
);

TaskComments.displayName = displayName;

export default TaskComments;
