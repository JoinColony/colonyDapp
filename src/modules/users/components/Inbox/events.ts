/*
 * @note These are used as notification events constants
 * make sure that these match the IDs of the corresponding message descriptors
 * in the `messages.ts` file
 */
export const NOTIFICATION_EVENT_COLONY_ENS_CREATED =
  'notificationAdminENSCreated';
export const NOTIFICATION_EVENT_TOKENS_MINTED =
  'notificationAdminTokensGenerated';
export const NOTIFICATION_EVENT_DOMAIN_ADDED =
  'notificationAdminColonyLabelAdded';
export const NOTIFICATION_EVENT_COLONY_ROLE_SET = 'notificationColonyRoleSet';
export const NOTIFICATION_EVENT_ADMIN_REMOVED = 'notificationAdminOtherRemoved';
export const NOTIFICATION_EVENT_USER_MENTIONED = 'notificationUserMentioned';
export const NOTIFICATION_EVENT_USER_CLAIMED_PROFILE =
  'notificationUserClaimedProfile';
export const NOTIFICATION_EVENT_USER_TRANSFER =
  'notificationUserTransferReceived';
export const NOTIFICATION_EVENT_ASSIGNED = 'notificationWorkerAssigned';
export const NOTIFICATION_EVENT_UNASSIGNED = 'notificationWorkerUnassigned';
export const NOTIFICATION_EVENT_REQUEST_WORK = 'notificationWorkRequested';
export const NOTIFICATION_EVENT_TASK_FINALIZED = 'notificationTaskFinalized';
