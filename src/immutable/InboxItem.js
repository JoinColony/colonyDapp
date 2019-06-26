/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

// import BN from 'bn.js';

import { Record } from 'immutable';

type Shared = {|
  id?: string,
  type?: string,
  sourceId: string,
  sourceType: string,
  timestamp?: number,
  sourceAddress?: string,
  onClickRoute?: string,
  context?: Object,
  unread?: boolean,
|};

/*
  // @TODO: InboxItem type should be more generic
  // @BODY: Have a "context" property for all these properties except for: id, timestamp, onClickRoute, sourceUserAddress, targetUserAddress, colonyAddress and unread
  comment?: string,
  taskTitle?: string,
  event: string,
  unread?: boolean,
  timestamp?: Date | number,
  colonyName?: string,
  colonyAddress?: string,
  domainName?: string,
  domainId?: number,
  amount?: BN,
  tokenAddress?: string,
*/

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
