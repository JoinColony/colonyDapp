/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './TaskSkills.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskSkills.title',
    defaultMessage: 'Task Skills',
  },
});

const displayName = 'dashboard.TaskSkills';

const TaskSkills = () => (
  <div className={styles.main}>
    <FormattedMessage {...MSG.title} />
  </div>
);

TaskSkills.displayName = displayName;

export default TaskSkills;
