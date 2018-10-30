/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';

import styles from './TaskRequestWork.css';

const MSG = defineMessages({
  closeTask: {
    id: 'dashboard.TaskRequestWork.closeTask',
    defaultMessage: 'Close Task',
  },
  requestWork: {
    id: 'dashboard.TaskRequestWork.requestWork',
    defaultMessage: 'Request Work',
  },
});

const displayName = 'dashboard.TaskRequestWork';

type Props = {
  isTaskCreator?: boolean,
};

const TaskRequestWork = ({ isTaskCreator = false }: Props) => (
  <div className={styles.main}>
    <Button text={isTaskCreator ? MSG.closeTask : MSG.requestWork} />
  </div>
);

TaskRequestWork.displayName = displayName;

export default TaskRequestWork;
