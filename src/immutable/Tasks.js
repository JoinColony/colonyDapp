/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { TaskRecord } from './Task';

type TaskId = string;

export type TasksProps = {
  tasks: ImmutableMap<TaskId, TaskRecord>,
};

export type TasksRecord = RecordOf<TasksProps>;

const defaultValues: TasksProps = {
  tasks: new ImmutableMap(),
};

const Tasks: RecordFactory<TasksProps> = Record(defaultValues);

export default Tasks;
