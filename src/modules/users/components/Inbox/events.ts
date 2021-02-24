import { EventType } from '~data/index';

const notificationsToEventsMapping = {
  /*
   * Even though there are many more events that get generated
   * we only get notifications created (currently) for these
   * Note: these have to match the corresponding keys in `messages.ts`
   */
  [EventType.AssignWorker]: 'notificationWorkerAssigned',
  [EventType.NewUser]: 'notificationUserClaimedProfile',
  [EventType.CreateDomain]: 'notificationAdminColonyDomainCreated',
  [EventType.CreateWorkRequest]: 'notificationWorkRequested',
  [EventType.SendWorkInvite]: 'actionWorkerInviteReceived',
  [EventType.UnassignWorker]: 'notificationWorkerUnassigned',
};

export const transformNotificationEventNames = (eventName: string): string =>
  notificationsToEventsMapping[eventName] || '__failSafe';
