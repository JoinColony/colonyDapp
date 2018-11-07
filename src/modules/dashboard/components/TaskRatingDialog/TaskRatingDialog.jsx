/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './TaskRatingDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskRatingDialog.title',
    defaultMessage: 'Task Rating',
  },
});

const displayName = 'dashboard.TaskRatingDialog';

const TaskRatingDialog = () => (
  <div className={styles.main}>
    <FormattedMessage {...MSG.title} />
  </div>
);

TaskRatingDialog.displayName = displayName;

export default TaskRatingDialog;
