import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

import { User, UserType, UserRecord } from './User';

interface TaskRatingRecordProps {
  ratee: UserRecord;
  rater: UserRecord;
  rating: number;
}

export type TaskRatingType = Readonly<{
  ratee: UserType;
  rater: UserType;
  rating: number;
}>;

const defaultValues: DefaultValues<TaskRatingRecordProps> = {
  ratee: User(),
  rater: User(),
  rating: -1,
};

export class TaskRatingRecord extends Record<TaskRatingRecordProps>(
  defaultValues,
) {}

export const TaskRating = (p: TaskRatingRecordProps) => new TaskRatingRecord(p);
