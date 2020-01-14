import { EventType } from '~data/index';

const notificationsToEventsMapping = {
  /*
   * Even though there are many more events that get generated
   * we only get notifications created (currently) for these four
   * Note: these have to match the corresponding keys in `messages.ts`
   */
  [EventType.AssignWorker]: 'notificationWorkerAssigned',
  [EventType.NewUser]: 'notificationUserClaimedProfile',
  [EventType.CreateTask]: 'notificationTaskCreated',
  [EventType.CreateDomain]: 'notificationAdminColonyDomainCreated',
  [EventType.CreateWorkRequest]: 'notificationWorkRequested',
  [EventType.FinalizeTask]: 'notificationTaskFinalized',
  [EventType.TaskMessage]: 'notificationUserMentioned',
  [EventType.SendWorkInvite]: 'actionWorkerInviteReceived',
  [EventType.UnassignWorker]: 'notificationWorkerUnassigned',
};

export const transformNotificationEventNames = (eventName: string): string =>
  notificationsToEventsMapping[eventName] || '__failSafe';
