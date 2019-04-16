/* @flow */

import type { RecordFactory, RecordOf, List as ListType } from 'immutable';

import { List, Record } from 'immutable';

import type { Address } from '~types';

type Shared = {|
  authorAddress: Address,
  body: string,
  signature: string,
|};

export type TaskCommentType = $ReadOnly<{|
  ...Shared,
  mentions: string[],
|}>;

type TaskCommentRecordProps = {|
  ...Shared,
  mentions: ListType<string>,
|};

export type TaskCommentRecordType = RecordOf<TaskCommentRecordProps>;

const defaultValues: $Shape<TaskCommentRecordProps> = {
  authorAddress: undefined,
  body: undefined,
  mentions: List(),
  signature: undefined,
};

const TaskCommentRecord: RecordFactory<TaskCommentRecordProps> = Record(
  defaultValues,
);

export default TaskCommentRecord;
