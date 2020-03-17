import { EventType } from '~data/index';

const notificationsToEventsMapping = {
  /*
   * Even though there are many more events that get generated
   * we only get notifications created (currently) for these
   * Note: these have to match the corresponding keys in `messages.ts`
   */
  [EventType.AcceptLevelTaskSubmission]: 'notificationLevelTaskAccepted',
  [EventType.AssignWorker]: 'notificationWorkerAssigned',
  [EventType.NewUser]: 'notificationUserClaimedProfile',
  [EventType.CreateLevelTaskSubmission]: 'notificationLevelTaskSubmitted',
  [EventType.CreateTask]: 'notificationTaskCreated',
  [EventType.CreateDomain]: 'notificationAdminColonyDomainCreated',
  [EventType.CreateWorkRequest]: 'notificationWorkRequested',
  [EventType.EnrollUserInProgram]: 'notificationUserEnrolled',
  [EventType.FinalizeTask]: 'notificationTaskFinalized',
  [EventType.TaskMessage]: 'notificationUserMentioned',
  [EventType.SendWorkInvite]: 'actionWorkerInviteReceived',
  [EventType.UnassignWorker]: 'notificationWorkerUnassigned',
  [EventType.SetTaskPayout]: 'notificationTaskPayoutSet',
  [EventType.RemoveTaskPayout]: 'notificationTaskPayoutRemove',
  [EventType.CancelTask]: 'notificationTaskCancel',
  [EventType.UnlockNextLevel]: 'notificationNextLevelUnlocked',
};

export const transformNotificationEventNames = (eventName: string): string =>
  notificationsToEventsMapping[eventName] || '__failSafe';
