/* @flow */

import React from 'react';

import { Table, TableBody } from '~core/Table';

import TaskListItem from './TaskListItem.jsx';

type Props = {
  // TODO: type better as soon as actual structure is known
  tasks: Array<Object>,
};

const TaskList = ({ tasks }: Props) => (
  <Table scrollable>
    <TableBody>
      {tasks.map(task => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </TableBody>
  </Table>
);

export default TaskList;
