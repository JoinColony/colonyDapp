/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List } from 'immutable';

import TaskReference from '../../TaskReference';

type Shared = {|
  open: List<TaskReference>,
  closed: List<TaskReference>,
|};

export type CurrentUserTasksType = $ReadOnly<Shared>;

export type CurrentUserTasksRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  open: undefined,
  closed: undefined,
};

const CurrentUserTasksRecord: RecordFactory<Shared> = Record(defaultValues);

export default CurrentUserTasksRecord;
