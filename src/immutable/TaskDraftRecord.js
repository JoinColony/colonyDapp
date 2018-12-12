/* @flow */

import type { RecordOf, List } from 'immutable';
import type { ENSName } from '~types';
import type { UserRecord } from './User';
import type { TaskFeedItemRecord } from './TaskFeedItem';

export type draftProps = {
  id?: number,
  specHash?: string,
  title: string,
  dueDate?: Date,
  colonyENSName: ENSName,
  domainName?: string,
  creator: string,
  assignee?: UserRecord,
  feedItems: List<TaskFeedItemRecord>,
};

export type DraftRecord = RecordOf<draftProps>;
