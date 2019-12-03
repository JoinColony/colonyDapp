import { Record } from 'immutable';

import { Address, DefaultValues, RecordToJS } from '~types/index';

interface TaskRatingRecordProps {
  ratee: Address;
  rater: Address;
  rating: number;
}

export type TaskRatingType = Readonly<{
  ratee: Address;
  rater: Address;
  rating: number;
}>;

const defaultValues: DefaultValues<TaskRatingRecordProps> = {
  ratee: undefined,
  rater: undefined,
  rating: -1,
};

export class TaskRatingRecord
  extends Record<TaskRatingRecordProps>(defaultValues)
  implements RecordToJS<TaskRatingRecordProps> {}

export const TaskRating = (p: TaskRatingRecordProps) => new TaskRatingRecord(p);
