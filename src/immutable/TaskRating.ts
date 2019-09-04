import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { UserRecord, UserType, UserRecordType } from './User';

interface TaskRatingRecordProps {
  ratee: UserRecordType;
  rater: UserRecordType;
  rating: number;
}

export type TaskRatingType = $ReadOnly<{
  ratee: UserType;
  rater: UserType;
  rating: number;
}>;

export type TaskRatingRecordType = RecordOf<TaskRatingRecordProps>;

const defaultValues = {
  ratee: UserRecord(),
  rater: UserRecord(),
  rating: -1,
};

export const TaskRatingRecord: Record.Factory<TaskRatingRecordProps> = Record(
  defaultValues,
);

export default TaskRatingRecord;
