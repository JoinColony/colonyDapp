/* @flow */

import React from 'react';

import { Table, TableBody } from '~core/Table';

import TaskListItem from './TaskListItem.jsx';

type Props = {|
  // Array of draftIds
  tasks: string[],
|};

const TaskList = ({ tasks }: Props) => (
  <Table data-test="dashboardTaskList" scrollable>
    <TableBody>
      {tasks.map(draftId => (
        <TaskListItem key={draftId} draftId={draftId} />
      ))}
    </TableBody>
  </Table>
);

export default TaskList;
