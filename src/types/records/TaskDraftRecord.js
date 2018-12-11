/* @flow */

import type { RecordOf, List } from 'immutable';
import type { UserRecord } from './UserRecord';

import type { ENSName, TaskFeedItemRecord } from '~types';

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
