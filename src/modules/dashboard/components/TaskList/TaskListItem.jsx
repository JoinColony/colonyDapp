/* @flow */

import React from 'react';

import { TableRow, TableCell } from '~core/Table';

import styles from './TaskListItem.css';

type Props = {
  // TODO: type better as soon as actual structure is known
  task: Object,
};

const TaskListItem = ({ task }: Props) => (
  <TableRow>
    <TableCell className={styles.taskDetails}>
      <span className={styles.taskDetailsTitle}>{task.title}</span>
    </TableCell>
    <TableCell className={styles.taskPayout}>Payout</TableCell>
    <TableCell className={styles.userAvatar}>AV</TableCell>
  </TableRow>
);

export default TaskListItem;
