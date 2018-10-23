/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './TaskDomains.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskDomains.title',
    defaultMessage: 'Domains',
  },
});

const displayName = 'dashboard.TaskDomains';

const TaskDomains = () => (
  <div className={styles.main}>
    <FormattedMessage {...MSG.title} />
  </div>
);

TaskDomains.displayName = displayName;

export default TaskDomains;
