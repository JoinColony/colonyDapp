/* @flow */

// @TODO add flow typing here

type EventTypeId = string;
type EventTypeDictionary = {
  [eventType: EventTypeId]: string,
};

export const TASK_EVENT_TYPES = ({
  COMMENT_STORE_CREATED: 'COMMENT_STORE_CREATED',
  DRAFT_UPDATED: 'DRAFT_UPDATED',
  DUE_DATE_SET: 'DUE_DATE_SET',
  SKILL_SET: 'SKILL_SET',
}: EventTypeDictionary);

export const USER_EVENT_TYPES = ({
  // @TODO: Add inbox event types
  READ_UNTIL: 'READ_UNTIL',
}: EventTypeDictionary);

export const COLONY_EVENT_TYPES = ({
  COLONY_STORE_INITIALIZED: 'INITIALIZE',
  ADMIN_ADDED: 'ADMIN_ADDED',
  ADMIN_REMOVED: 'ADMIN_REMOVED',
  AVATAR_UPLOADED: 'AVATAR_UPLOADED',
  AVATAR_REMOVED: 'AVATAR_REMOVED',
  DOMAIN_ADDED: 'DOMAIN_ADDED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  TOKEN_INFO_ADDED: 'TOKEN_INFO_ADDED',
}: EventTypeDictionary);
