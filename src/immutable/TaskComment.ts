import { $ReadOnly } from 'utility-types';

import { RecordOf, List as ListType, List, Record } from 'immutable';

import { Address } from '~types/index';

type Shared = {
  authorAddress: Address;
  body: string;
  signature: string;
};

export type TaskCommentType = $ReadOnly<
  Shared & {
    mentions: string[];
  }
>;

type TaskCommentRecordProps = Shared & {
  mentions: ListType<string>;
};

export type TaskCommentRecordType = RecordOf<TaskCommentRecordProps>;

const defaultValues: Partial<TaskCommentRecordProps> = {
  authorAddress: undefined,
  body: undefined,
  mentions: List(),
  signature: undefined,
};

export const TaskCommentRecord: Record.Factory<
  Partial<TaskCommentRecordProps>
> = Record(defaultValues);

export default TaskCommentRecord;
