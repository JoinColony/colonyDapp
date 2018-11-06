/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './TaskRating.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskRating.title',
    defaultMessage: 'Task Rating',
  },
});

const displayName = 'dashboard.TaskRating';

const TaskRating = () => (
  <div className={styles.main}>
    <FormattedMessage {...MSG.title} />
  </div>
);

TaskRating.displayName = displayName;

export default TaskRating;
