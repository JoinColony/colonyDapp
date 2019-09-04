import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';

interface Shared {
  id: string;
  type: string;
  sourceId: string;
  sourceType: string;
  timestamp: number;
  sourceAddress: Address;
  onClickRoute?: string;
  context: any;
  unread: boolean;
}

export type InboxItemType = $ReadOnly<Shared>;

export type InboxItemRecordType = RecordOf<Shared>;

const defaultValues: Shared = {
  id: '',
  type: '',
  timestamp: Date.now(),
  sourceId: '',
  sourceType: '',
  sourceAddress: '',
  onClickRoute: undefined,
  context: undefined,
  unread: true,
};

export const InboxItemRecord: Record.Factory<Shared> = Record(defaultValues);

export default InboxItemRecord;
