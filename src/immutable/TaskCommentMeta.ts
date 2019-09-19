import { Record, List } from 'immutable';

import { DefaultValues } from '~types/index';

type TaskCommentMetaRecordProps = {
  mentions?: List<string>;
};

export type TaskCommentMetaType = Readonly<{
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
