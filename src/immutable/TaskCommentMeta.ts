import { $ReadOnly } from 'utility-types';
import { Record, List } from 'immutable';

import { DefaultValues } from '~types/index';

type TaskCommentMetaRecordProps = {
  mentions?: List<string>;
};

export type TaskCommentMetaType = $ReadOnly<{
  mentions?: string[];
}>;

const defaultValues: DefaultValues<TaskCommentMetaRecordProps> = {
  mentions: List(),
};

export class TaskCommentMetaRecord extends Record<TaskCommentMetaRecordProps>(
  defaultValues,
) {}

export const TaskCommentMeta = (p?: TaskCommentMetaRecordProps) =>
  new TaskCommentMetaRecord(p);
