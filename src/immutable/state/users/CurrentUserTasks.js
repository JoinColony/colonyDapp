/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List } from 'immutable';

import type {
  TaskReferenceType,
  TaskReferenceRecordType,
} from '~immutable/TaskReference';

type JSPropsType = {|
  open: Array<TaskReferenceType>,
  closed: Array<TaskReferenceType>,
|};

type ImmutablePropsType = {|
  open: List<TaskReferenceRecordType>,
  closed: List<TaskReferenceRecordType>,
|};

export type CurrentUserTasksType = $ReadOnly<JSPropsType>;

export type CurrentUserTasksRecordType = RecordOf<ImmutablePropsType>;

const defaultValues: $Shape<ImmutablePropsType> = {
  open: undefined,
  closed: undefined,
};

const CurrentUserTasksRecord: RecordFactory<ImmutablePropsType> = Record(
  defaultValues,
);

export default CurrentUserTasksRecord;
