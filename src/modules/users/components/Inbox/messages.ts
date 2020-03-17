/* eslint max-len: 0 */

import { defineMessages } from 'react-intl';

// In format:
// - `action` or `notification`
// - `colony` or `$role` the notification is intended for
// - `$event` that happened
const messages = defineMessages({
  /*
   * @NOTE This is generic message that we have to show in the rare case when
   * the server even won't provide an eventType
   */
  __failSafe: {
    id: 'dashboard.Inbox.InboxItem.genericFailsafe',
    defaultMessage:
      'You should not be seeing this. Please report this bug stating the notification type: {type}',
  },
  // Protip: this has nothing to do with the meta colony
  metaColonyOnly: {
    id: 'dashboard.Inbox.InboxItem.metaColonyOnly',
    defaultMessage: '{colonyDisplayName}',
  },
  metaColonyAndDomain: {
    id: 'dashboard.Inbox.InboxItem.metaColonyAndDomain',
    defaultMessage: '{domainName} in {colonyDisplayName}',
  },
  actionColonyFundingReceived: {
    id: 'dashboard.Inbox.InboxItem.actionColonyFundingReceived',
    defaultMessage:
      '{user} sent {amount} to {colonyDisplayName}. You need to claim these tokens.',
  },
  actionWorkerInviteReceived: {
    id: 'dashboard.Inbox.InboxItem.actionWorkerInviteReceived',
    defaultMessage:
      '{user} invited you to work on {task}. Click here to respond.',
  },
  actionWorkerTaskFinalized: {
    id: 'dashboard.Inbox.InboxItem.actionWorkerTaskFinalized',
    defaultMessage:
      '{user} has finalized {task}. You can now claim your reward.',
  },
  notificationColonyRoleSet: {
    id: 'dashboard.Inbox.InboxItem.notificationAdminOtherAdded',
    defaultMessage:
      '{setTo,select,true{{user} added {otherUser} as an admin to {colonyDisplayName}.}false{{user} removed {otherUser} as an admin from {colonyDisplayName}.}}',
  },
  notificationAdminENSCreated: {
    id: 'dashboard.Inbox.InboxItem.notificationAdminENSCreated',
    defaultMessage:
      'Colony {colonyAddress} was registered on ENS as {colonyName}.',
  },
  notificationAdminColonyDomainCreated: {
    id: 'dashboard.Inbox.InboxItem.notificationAdminColonyDomainCreated',
    defaultMessage:
      '{user} added a new domain titled {domainName} to {colonyDisplayName}.',
  },
  notificationAdminTokensGenerated: {
    id: 'dashboard.Inbox.InboxItem.notificationAdminTokensGenerated',
    defaultMessage: '{user} generated {amount} tokens in {colonyDisplayName}.',
  },
  notificationTaskCreated: {
    id: 'dashboard.Inbox.InboxItem.notificationTaskCreated',
    defaultMessage: '{user} has created a new task: {task}.',
  },
  notificationUserMentioned: {
    id: 'dashboard.Inbox.InboxItem.notificationUserMentioned',
    defaultMessage: '{user} mentioned you in {task}: {comment}',
  },
  notificationUserMadeAdmin: {
    id: 'dashboard.Inbox.InboxItem.notificationUserMadeAdmin',
    defaultMessage: '{user} added you as an admin to {colonyDisplayName}.',
  },
  notificationUserAdminRevoked: {
    id: 'dashboard.Inbox.InboxItem.notificationUserAdminRevoked',
    defaultMessage: '{user} removed you as an admin from {colonyDisplayName}.',
  },
  notificationUserTransferReceived: {
    id: 'dashboard.Inbox.InboxItem.notificationUserTransferReceived',
    defaultMessage: '{user} sent you {amount}.',
  },
  notificationUserClaimedProfile: {
    id: 'dashboard.Inbox.InboxItem.notificationUserClaimedProfile',
    defaultMessage:
      'Your first transaction is complete! Your username is {user}. Enjoy colony 🎉',
  },
  // payments notifications
  notificationLevelTaskAccepted: {
    id: 'dashboard.Inbox.InboxItem.notificationLevelTaskAccepted',
    defaultMessage:
      '{user} accepted {task} in {program}. You received {amount}.',
  },
  notificationWorkerAssigned: {
    id: 'dashboard.Inbox.InboxItem.notificationWorkerAssigned',
    defaultMessage: '{user} assigned you as a worker for {task}.',
  },
  notificationWorkerUnassigned: {
    id: 'dashboard.Inbox.InboxItem.notificationWorkerUnassigned',
    defaultMessage: '{user} removed you as a worker from {task}.',
  },
  notificationWorkRequested: {
    id: 'dashboard.Inbox.InboxItem.notificationWorkRequested',
    defaultMessage: '{user} requested to work on {task}.',
  },
  notificationTaskFinalized: {
    id: 'dashboard.Inbox.InboxItem.notificationTaskFinalized',
    defaultMessage: '{user} finalized {task} and payouts have been made.',
  },
  notificationTaskPayoutSet: {
    id: 'dashboard.Inbox.InboxItem.notificationTaskPayoutSet',
    defaultMessage: '{user} added payout to {task}: {amount}',
  },
  notificationTaskPayoutRemove: {
    id: 'dashboard.Inbox.InboxItem.notificationTaskPayoutRemove',
    defaultMessage: '{user} removed the payout from {task}',
  },
  notificationTaskCancel: {
    id: 'dashboard.Inbox.InboxItem.notificationTaskCancel',
    defaultMessage: '{user} has cancelled the task: {task}.',
  },
  /*
   * These are currently unused:
   *
    actionManagerBudgetModificationAccepted: {
      id: 'dashboard.Inbox.InboxItem.actionManagerBudgetModificationAccepted',
      defaultMessage:
        '{user} has approved the bounty modification to {task}. Click here to complete the transaction and set the new bounty.',
    },
    actionWorkerBudgetModificationRequest: {
      id: 'dashboard.Inbox.InboxItem.actionWorkerBudgetModificationRequest',
      defaultMessage:
        '{user} has requested to change the budget on {task}. You have 24-hours to respond before the modification is automatically approved.',
    },
    actionWorkerAssignmentModificationRequest: {
      id: 'dashboard.Inbox.InboxItem.actionWorkerAssignmentModificationRequest',
      defaultMessage:
        '{user} has requested to remove you as the assignee on {task}. You have 24-hours to respond before the modification is automatically approved.',
    },
    actionManagerRatingPeriodEnded: {
      id: 'dashboard.Inbox.InboxItem.actionManagerRatingPeriodEnded',
      defaultMessage:
        "{task}'s rating period has ended. You can now finalize the task.",
    },
    actionEvaluatorRatingSubmitted: {
      id: 'dashboard.Inbox.InboxItem.actionEvaluatorRatingSubmitted',
      defaultMessage:
        '{user} submitted their work for {task}. You have 5-days to rate the worker.',
    },
    actionEvaluatorRatingRevealed: {
      id: 'dashboard.Inbox.InboxItem.actionEvaluatorRatingRevealed',
      defaultMessage:
        '{user} has submitted their rating for {task}. You have 5-days to reveal your rating.',
    },
    actionWorkerRatingPeriodBegun: {
      id: 'dashboard.Inbox.InboxItem.actionWorkerRatingPeriodBegun',
      defaultMessage:
        '{user} has ended {task} and it has entered the rating period. You have 5-days to rate the manager.',
    },
    actionWorkerRatingSubmitted: {
      id: 'dashboard.Inbox.InboxItem.actionWorkerRatingSubmitted',
      defaultMessage:
        '{user} has rated your work on {task}. You have 5 days to reveal your rating.',
    },
    actionWorkerRevealPeriodEnded: {
      id: 'dashboard.Inbox.InboxItem.actionWorkerRevealPeriodEnded',
      defaultMessage:
        "{task}'s rating period has ended. You can now finalize the task and claim your reward.",
    },
    notificationManagerRequestReceived: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerRequestReceived',
      defaultMessage: '{user} submitted a work request for {task}',
    },
    notificationManagerRequestCancelled: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerRequestCancelled',
      defaultMessage: '{user} cancelled their work request for {task}',
    },
    notificationManagerInviteAccepted: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerInviteAccepted',
      defaultMessage: '{user} accepted the work invite for {task}.',
    },
    notificationManagerInviteDeclined: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerInviteDeclined',
      defaultMessage: '{user} declined the work invite for {task}.',
    },
    notificationManagerCommentAdded: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerCommentAdded',
      defaultMessage: '{user} commented on {task}: {comment}',
    },
    notificationManagerFileAdded: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerFileAdded',
      defaultMessage: '{user} uploaded a file to {task}',
    },
    notificationManagerDueDateApproaching: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerDueDateApproaching',
      defaultMessage: '{task} is due in {time}.',
    },
    notificationManagerBudgetModificationRejected: {
      id:
        'dashboard.Inbox.InboxItem.notificationManagerBudgetModificationRejected',
      defaultMessage:
        '{user} has rejected the bounty modification to {task}. The bounty has returned to {amount}.',
    },
    notificationManagerAssignmentModificationRejected: {
      id:
        'dashboard.Inbox.InboxItem.notificationManagerAssignmentModificationRejected',
      defaultMessage: '{user} has rejected the assignment modification to {task}',
    },
    notificationManagerAssignmentModificationAccepted: {
      id:
        'dashboard.Inbox.InboxItem.notificationManagerAssignmentModificationAccepted',
      defaultMessage:
        '{user} has accepted the assignment modification to {task}. The task is now unassigned.',
    },
    notificationWorkerCommentAdded: {
      id: 'dashboard.Inbox.InboxItem.notificationWorkerCommentAdded',
      defaultMessage: '{user} commented on {task}: {comment}',
    },
    notificationWorkerFileAdded: {
      id: 'dashboard.Inbox.InboxItem.notificationWorkerFileAdded',
      defaultMessage: '{user} uploaded a file to {task}',
    },
    notificationWorkerDueDateApproaching: {
      id: 'dashboard.Inbox.InboxItem.notificationWorkerDueDateApproaching',
      defaultMessage: '{task} is due in {time}.',
    },
    notificationManagerRatingPeriodBegun: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerRatingPeriodBegun',
      defaultMessage:
        "{task}'s due date has passed. You can optionally end the task and rate the worker.",
    },
    notificationManagerTaskFinalized: {
      id: 'dashboard.Inbox.InboxItem.notificationManagerTaskFinalized',
      defaultMessage: '{user} has finalized {task} and it is now closed. ',
    },
    notificationEvaluatorRatingPeriodEndedPenalized: {
      id:
        'dashboard.Inbox.InboxItem.notificationEvaluatorRatingPeriodEndedPenalized',
      defaultMessage:
        "{task}'s rating period has ended and you've been penalized.",
    },
    notificationEvaluatorRevealPeriodEndedPenalized: {
      id:
        'dashboard.Inbox.InboxItem.notificationEvaluatorRevealPeriodEndedPenalized',
      defaultMessage:
        "{task}'s reveal period has ended and you've been penalized.",
    },
    notificationWorkerDueDatePassed: {
      id: 'dashboard.Inbox.InboxItem.notificationWorkerDueDatePassed',
      defaultMessage:
        "{task}'s due date has passed. {user} can now optionally end the task.",
    },
    notificationWorkerRatingPeriodEndedPenalized: {
      id:
        'dashboard.Inbox.InboxItem.notificationWorkerRatingPeriodEndedPenalized',
      defaultMessage:
        "{task}'s rating period has ended and you've been penalized.",
    },
    notificationWorkerRevealPeriodEndedPenalized: {
      id:
        'dashboard.Inbox.InboxItem.notificationWorkerRevealPeriodEndedPenalized',
      defaultMessage:
        "{task}'s reveal period has ended and you've been penalized.",
    },
  *
  */
});
export default messages;
