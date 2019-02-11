/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '../types';
import type {
  TaskCommentMetaRecordType,
  TaskCommentMetaType,
} from './TaskCommentMeta';

type Shared = {|
  id: string,
  author: Address,
  timestamp: Date,
  body: string,
|};

type TaskCommentContentProps = {|
  ...Shared,
  metadata?: TaskCommentMetaRecordType,
|};

export type TaskCommentContentType = $ReadOnly<{|
  ...Shared,
  metadata?: TaskCommentMetaType,
|}>;

export type TaskCommentContentRecordType = RecordOf<TaskCommentContentProps>;

const defaultValues: $Shape<TaskCommentContentProps> = {
  id: undefined,
  author: undefined,
  timestamp: new Date(),
  body: undefined,
};

const TaskCommentContentRecord: RecordFactory<TaskCommentContentProps> = Record(
  defaultValues,
);

export default TaskCommentContentRecord;
