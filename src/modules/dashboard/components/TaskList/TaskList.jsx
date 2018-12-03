/* @flow */

import type { List } from 'immutable';

import React from 'react';

import { Table, TableBody } from '~core/Table';

import TaskListItem from './TaskListItem.jsx';

import type { TaskRecord } from '~immutable';

type Props = {
  tasks: List<TaskRecord>,
};

const TaskList = ({ tasks }: Props) => (
  <Table scrollable>
    <TableBody>
      {tasks.toArray().map(task => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </TableBody>
  </Table>
);

export default TaskList;
