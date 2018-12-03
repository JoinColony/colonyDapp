/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { ActivityFeedItemProps } from '~types';

const defaultValues: ActivityFeedItemProps = {
  id: 0,
  actionType: 'commentedOn',
  date: new Date(),
  user: undefined,
  task: '',
  organization: '',
  domainTag: '',
};

const ActivityFeedItem: RecordFactory<ActivityFeedItemProps> = Record(
  defaultValues,
);

export default ActivityFeedItem;
