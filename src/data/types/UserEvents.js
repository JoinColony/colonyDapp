/* @flow */

import { USER_EVENT_TYPES } from '../constants';

import type { Address } from '~types';
import type { TaskDraftId } from '~immutable';

import type { EventDefinition } from './events';

const {
  READ_UNTIL,
  SUBSCRIBED_TO_COLONY,
  SUBSCRIBED_TO_TASK,
  UNSUBSCRIBED_FROM_COLONY,
  UNSUBSCRIBED_FROM_TASK,
  TOKEN_ADDED,
  TOKEN_REMOVED,
  COMMENT_MENTION,
} = USER_EVENT_TYPES;

export type UserEvents = {|
  READ_UNTIL: EventDefinition<
    typeof READ_UNTIL,
    {|
      readUntil: string,
      exceptFor?: string[],
    |},
  >,
  SUBSCRIBED_TO_COLONY: EventDefinition<
    typeof SUBSCRIBED_TO_COLONY,
    {| colonyAddress: Address |},
  >,
  UNSUBSCRIBED_FROM_COLONY: EventDefinition<
    typeof UNSUBSCRIBED_FROM_COLONY,
    {| colonyAddress: Address |},
  >,
  SUBSCRIBED_TO_TASK: EventDefinition<
    typeof SUBSCRIBED_TO_TASK,
    {|
      colonyAddress: Address,
      draftId: TaskDraftId,
    |},
  >,
  UNSUBSCRIBED_FROM_TASK: EventDefinition<
    typeof UNSUBSCRIBED_FROM_TASK,
    {|
      colonyAddress: Address,
      draftId: TaskDraftId,
    |},
  >,
  TOKEN_ADDED: EventDefinition<
    typeof TOKEN_ADDED,
    {|
      address: Address,
    |},
  >,
  TOKEN_REMOVED: EventDefinition<
    typeof TOKEN_REMOVED,
    {|
      address: Address,
    |},
  >,
  COMMENT_MENTION: EventDefinition<
    typeof COMMENT_MENTION,
    {|
      colonyAddress: Address,
      draftId: TaskDraftId,
      taskTitle?: string,
      comment: string,
      sourceUsername: string,
      sourceUserWalletAddress: string,
    |},
  >,
|};
