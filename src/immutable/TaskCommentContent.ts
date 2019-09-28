import { Record } from 'immutable';

import { Address, DefaultValues, RecordToJS } from '~types/index';

import {
  TaskCommentMetaRecord,
  TaskCommentMeta,
  TaskCommentMetaType,
} from './TaskCommentMeta';

type Shared = {
  author: Address;
  body: string;
  id: string;
  timestamp: Date;
};

type TaskCommentContentRecordProps = Shared & {
  metadata?: TaskCommentMetaRecord;
};

export type TaskCommentContentType = Readonly<
  Shared & {
    metadata?: TaskCommentMetaType;
  }
>;

const defaultValues: DefaultValues<TaskCommentContentRecordProps> = {
  author: undefined,
  body: undefined,
  id: undefined,
  metadata: TaskCommentMeta(),
  timestamp: new Date(),
};

export class TaskCommentContent
  extends Record<TaskCommentContentRecordProps>(defaultValues)
  implements RecordToJS<TaskCommentContentType> {}
