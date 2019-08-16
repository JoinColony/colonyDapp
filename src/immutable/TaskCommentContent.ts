import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';
import {
  TaskCommentMetaRecordType,
  TaskCommentMetaType,
} from './TaskCommentMeta';

type Shared = {
  id: string;
  author: Address;
  timestamp: Date;
  body: string;
};

type TaskCommentContentProps = Shared & {
  metadata?: TaskCommentMetaRecordType;
};

export type TaskCommentContentType = $ReadOnly<
  Shared & {
    metadata?: TaskCommentMetaType;
  }
>;

export type TaskCommentContentRecordType = RecordOf<TaskCommentContentProps>;

const defaultValues: Partial<TaskCommentContentProps> = {
  id: undefined,
  author: undefined,
  timestamp: new Date(),
  body: undefined,
};

export const TaskCommentContentRecord: Record.Factory<
  Partial<TaskCommentContentProps>
> = Record(defaultValues);

export default TaskCommentContentRecord;
