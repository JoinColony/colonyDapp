/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List } from 'immutable';

import type { UserRecord } from './User';
import type { TaskFeedItemId } from './TaskFeedItem';
import type { DomainId } from './Domain';

export type DraftProps = {
  assignee?: UserRecord,
  creator: string,
  databases: {
    draftStore: ?string,
  },
  domainId?: DomainId,
  dueDate?: Date,
  feedItems: List<TaskFeedItemId>,
  id: string,
  specificationHash?: string,
  title: string,
};

export type DraftRecord = RecordOf<DraftProps>;

export type DraftId = $PropertyType<DraftRecord, 'id'>;

const defaultValues: $Shape<DraftProps> = {
  assignee: undefined,
  creator: undefined,
  databases: {
    draftStore: undefined,
  },
  domainId: undefined,
  dueDate: undefined,
  feedItems: List(),
  id: undefined,
  specificationHash: undefined,
  title: undefined,
};

const Draft: RecordFactory<DraftProps> = Record(defaultValues);

export default Draft;
