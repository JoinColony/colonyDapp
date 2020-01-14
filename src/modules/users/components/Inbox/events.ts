/*
 * @note These are used as notification events constants
 * make sure that these match the IDs of the corresponding message descriptors
 * in the `messages.ts` file
 */
export const NOTIFICATION_EVENT_USER_MENTIONED = 'notificationUserMentioned';
export const NOTIFICATION_EVENT_USER_CLAIMED_PROFILE =
  'notificationUserClaimedProfile';
export const NOTIFICATION_EVENT_REQUEST_WORK = 'notificationWorkRequested';
export const NOTIFICATION_EVENT_WORK_INVITE = 'actionWorkerInviteReceived';
/*
 * @NOTE This is generic message that we have to show in the rare case when
 * the server even won't provide an eventType
 */
export const NOTIFICATION_GENERIC_FAILSAFE = 'genericFailsafe';
