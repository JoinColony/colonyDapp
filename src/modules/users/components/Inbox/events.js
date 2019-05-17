/* @flow */

/*
 * @note These are used as notification events constants
 * make sure that these match the id's of the corresponding message descriptors
 * in the `messages.js` file
 */
export const NOTIFICATION_EVENT_COLONY_ENS_CREATED =
  'notificationAdminENSCreated';
export const NOTIFICATION_EVENT_TOKENS_MINTED =
  'notificationAdminTokensGenerated';
export const NOTIFICATION_EVENT_DOMAIN_ADDED =
  'notificationAdminColonyLabelAdded';
export const NOTIFICATION_EVENT_ADMIN_ADDED = 'notificationAdminOtherAdded';
export const NOTIFICATION_EVENT_ADMIN_REMOVED = 'notificationAdminOtherRemoved';
export const NOTIFICATION_EVENT_USER_MENTIONED = 'notificationUserMentioned';
export const NOTIFICATION_EVENT_USER_TRANSFER =
  'notificationUserTransferReceived';
