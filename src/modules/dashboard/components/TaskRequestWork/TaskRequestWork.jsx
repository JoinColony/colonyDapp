/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './TaskRequestWork.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskRequestWork.title',
    defaultMessage: 'Request Work',
  },
});

const displayName = 'dashboard.TaskRequestWork';

const TaskRequestWork = () => (
  <div className={styles.main}>
    <FormattedMessage {...MSG.title} />
  </div>
);

TaskRequestWork.displayName = displayName;

export default TaskRequestWork;
