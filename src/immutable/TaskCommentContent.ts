import { $ReadOnly } from 'utility-types';
import { Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

import {
  TaskCommentMetaRecord,
  TaskCommentMetaRecordType,
  TaskCommentMetaType,
} from './TaskCommentMeta';

type Shared = {
  author: Address;
  body: string;
  id: string;
  timestamp: Date;
};

type TaskCommentContentRecordProps = Shared & {
  metadata?: TaskCommentMetaRecordType;
};

export type TaskCommentContentType = $ReadOnly<
  Shared & {
    metadata?: TaskCommentMetaType;
  }
>;

const defaultValues: DefaultValues<TaskCommentContentRecordProps> = {
  author: undefined,
  body: undefined,
  id: undefined,
  metadata: TaskCommentMetaRecord(),
  timestamp: new Date(),
};

export class TaskCommentContent extends Record<TaskCommentContentRecordProps>(
  defaultValues,
) {}
