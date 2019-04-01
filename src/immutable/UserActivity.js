/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import { activityMessages } from '../modules/dashboard/components/UserActivities';

export type ActivityEvent = $Keys<typeof activityMessages>;

type Shared = {|
  comment?: string,
  tasK?: string,
  user?: string,
  event: string,
|};

export type UserActivityType = $ReadOnly<Shared>;

export type UserActivityRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  comment: undefined,
  task: undefined,
  user: undefined,
  event: undefined,
};

const UserActivityRecord: RecordFactory<Shared> = Record(defaultValues);

export default UserActivityRecord;
