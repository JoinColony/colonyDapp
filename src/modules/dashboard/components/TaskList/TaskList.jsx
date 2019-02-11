/* @flow */

import React from 'react';

import { Table, TableBody } from '~core/Table';

import TaskListItem from './TaskListItem.jsx';

import type { TaskType } from '~immutable';

type Props = {|
  tasks: Array<TaskType>,
|};

const TaskList = ({ tasks }: Props) => (
  <Table scrollable>
    <TableBody>
      {tasks.map(task => (
        <TaskListItem key={task.draftId} task={task} />
      ))}
    </TableBody>
  </Table>
);

export default TaskList;
