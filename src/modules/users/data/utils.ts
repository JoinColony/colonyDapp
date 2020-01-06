import { Address, ColonyClient, createAddress } from '~types/index';

import { EventType } from '~data/index';
import {
  NOTIFICATION_EVENT_USER_CLAIMED_PROFILE,
  NOTIFICATION_EVENT_REQUEST_WORK,
  NOTIFICATION_EVENT_USER_MENTIONED,
  NOTIFICATION_EVENT_WORK_INVITE,
} from '~users/Inbox/events';

const notificationsToEventsMapping = {
  /*
   * @NOTE Even though there are many more events that get generated
   * we only get notifications created (currently) for these four
   */
  [EventType.NewUser]: NOTIFICATION_EVENT_USER_CLAIMED_PROFILE,
  [EventType.CreateWorkRequest]: NOTIFICATION_EVENT_REQUEST_WORK,
  [EventType.TaskMessage]: NOTIFICATION_EVENT_USER_MENTIONED,
  [EventType.SendWorkInvite]: NOTIFICATION_EVENT_WORK_INVITE,
};

export const transformNotificationEventNames = (eventName: string): string =>
  notificationsToEventsMapping[eventName];

export const getExtensionAddresses = async (
  colonyClient: ColonyClient,
): Promise<[Address, Address]> => {
  const {
    address: oldRolesAddress,
  } = await colonyClient.getExtensionAddress.call({
    contractName: 'OldRoles',
  });
  const { address: oneTxAddress } = await colonyClient.getExtensionAddress.call(
    {
      contractName: 'OneTxPayment',
    },
  );

  return [createAddress(oldRolesAddress), createAddress(oneTxAddress)];
};
