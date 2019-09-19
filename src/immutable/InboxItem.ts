import { Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

interface Shared {
  id: string;
  type: string;
  sourceId: string;
  sourceType: string;
  timestamp?: number;
  sourceAddress: Address;
  onClickRoute?: string;
  context: any;
  unread?: boolean;
}

export type InboxItemType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  id: undefined,
  type: undefined,
  timestamp: Date.now(),
  sourceId: undefined,
  sourceType: undefined,
  sourceAddress: undefined,
  onClickRoute: undefined,
  context: undefined,
  unread: true,
};

export class InboxItemRecord extends Record<Shared>(defaultValues) {}

export const InboxItem = (p: Shared) => new InboxItemRecord(p);
