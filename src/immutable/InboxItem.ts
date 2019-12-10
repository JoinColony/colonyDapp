import { Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';
import { EVENT_SOURCE_TYPES } from '~data/types/index';
import { AnyUser } from '~data/index';

interface Shared {
  id: string;
  initiator: string | AnyUser;
  type: string;
  sourceId: string;
  sourceType: EVENT_SOURCE_TYPES;
  targetUser: string | AnyUser;
  timestamp?: number;
  onClickRoute?: string;
  context: any;
  unread?: boolean;
}

export type InboxItemType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  id: undefined,
  initiator: undefined,
  type: undefined,
  timestamp: Date.now(),
  sourceId: undefined,
  sourceType: undefined,
  targetUser: undefined,
  onClickRoute: undefined,
  context: undefined,
  unread: true,
};

export class InboxItemRecord extends Record<Shared>(defaultValues)
  implements RecordToJS<InboxItemType> {}

export const InboxItem = (p: Shared) => new InboxItemRecord(p);
