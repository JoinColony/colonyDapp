/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  id: string,
  type: string,
  sourceId: string,
  sourceType: string,
  timestamp: number,
  sourceAddress: string,
  onClickRoute?: string,
  context: Object,
  unread: boolean,
|};

export type InboxItemType = $ReadOnly<Shared>;

export type InboxItemRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  id: undefined,
  type: undefined,
  timestamp: undefined,
  sourceId: undefined,
  sourceType: undefined,
  sourceAddress: undefined,
  onClickRoute: undefined,
  context: undefined,
  unread: true,
};

const InboxItemRecord: RecordFactory<Shared> = Record(defaultValues);

export default InboxItemRecord;
