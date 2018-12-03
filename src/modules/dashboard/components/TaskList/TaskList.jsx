/* @flow */

import type { List } from 'immutable';

import React from 'react';

import { Table, TableBody } from '~core/Table';

import TaskListItem from './TaskListItem.jsx';

import type { ColonyRecord, TaskRecord } from '~types';

type Props = {
  colony: ColonyRecord,
  tasks: List<TaskRecord>,
};

const TaskList = ({ colony, tasks }: Props) => (
  <Table scrollable>
    <TableBody>
      {tasks.toArray().map(task => (
        <TaskListItem key={task.id} task={task} colony={colony} />
      ))}
    </TableBody>
  </Table>
);

export default TaskList;
