import { $ReadOnly } from 'utility-types';

import { List as ListType, List, Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

type Shared = {
  authorAddress: Address;
  body: string;
  signature: string;
};

export type TaskCommentType = $ReadOnly<
  Shared & {
    mentions?: string[];
  }
>;

type TaskCommentRecordProps = Shared & {
  mentions?: ListType<string>;
};

const defaultValues: DefaultValues<TaskCommentRecordProps> = {
  authorAddress: undefined,
  body: undefined,
  mentions: List(),
  signature: undefined,
};

export class TaskCommentRecord extends Record<TaskCommentRecordProps>(
  defaultValues,
) {}

export const TaskComment = (p: TaskCommentRecordProps) =>
  new TaskCommentRecord(p);
