/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';

import styles from './TaskDomains.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskDomains.title',
    defaultMessage: 'Domain',
  },
  addDomain: {
    id: 'dashboard.TaskDomains.add',
    defaultMessage: 'Add +',
  },
});

const displayName = 'dashboard.TaskDomains';

const TaskDomains = () => (
  <div className={styles.main}>
    <div className={styles.controls}>
      <Heading
        appearance={{ size: 'small', margin: 'none' }}
        text={MSG.title}
      />
      <Button
        appearance={{ theme: 'blue', size: 'small' }}
        text={MSG.addDomain}
      />
    </div>
    <div className={styles.selectedDomain}>
      #WhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhateverWhatever
    </div>
  </div>
);

TaskDomains.displayName = displayName;

export default TaskDomains;
