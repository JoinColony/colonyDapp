/* @flow */

import type { RecordFactory, RecordOf, List } from 'immutable';
import type { ENSName } from '~types';
import { Record } from 'immutable';
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
  feedItems?: List<TaskFeedItemRecord>,
};

const defaultValues: draftProps = {
  title: '',
  colonyENSName: '',
  creator: '',
};

export type DraftRecord = RecordOf<draftProps>;

const Draft: RecordFactory<draftProps> = Record(defaultValues);

export default Draft;
