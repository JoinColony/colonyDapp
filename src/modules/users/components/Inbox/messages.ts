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
});
export default messages;
