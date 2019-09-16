import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

import { UserRecord, UserType, UserRecordType } from './User';

interface TaskRatingRecordProps {
  ratee: UserRecordType;
  rater: UserRecordType;
  rating: number;
}

export type TaskRatingType = Readonly<{
  ratee: UserType;
  rater: UserType;
  rating: number;
}>;

const defaultValues: DefaultValues<TaskRatingRecordProps> = {
  ratee: UserRecord(),
  rater: UserRecord(),
  rating: -1,
};

export class TaskRatingRecord extends Record<TaskRatingRecordProps>(
  defaultValues,
) {}

export const TaskRating = (p: TaskRatingRecordProps) => new TaskRatingRecord(p);
