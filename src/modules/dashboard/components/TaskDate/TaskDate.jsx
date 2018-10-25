/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './TaskDate.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskDate.title',
    defaultMessage: 'Task Due Date',
  },
});

const displayName = 'dashboard.TaskDate';

const TaskDate = () => (
  <div className={styles.main}>
    <FormattedMessage {...MSG.title} />
  </div>
);

TaskDate.displayName = displayName;

export default TaskDate;
