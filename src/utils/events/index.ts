import { BigNumberish } from 'ethers/utils';
import { ColonyClient, ClientType } from '@colony/colony-js';

import ColonyManagerClass from '~lib/ColonyManager';
import {
  ColonyActions,
  ColonyAndExtensionsEvents,
  Address,
} from '~types/index';
import { ParsedEvent } from '~data/index';

import { ACTIONS_EVENTS } from '~dashboard/ActionsPage';

export const getPaymentDetails = async (
  paymentId: BigNumberish,
  colonyClient?: ColonyClient,
) => colonyClient?.getPayment(paymentId);

export const getDomainId = async (
  fundingPotId: BigNumberish,
  colonyClient?: ColonyClient,
) => colonyClient?.getDomainFromFundingPot(fundingPotId);

export const getActionType = (parsedEvents) => {
  if (!parsedEvents || !parsedEvents.length) {
    return ColonyActions.Generic;
  }
  const [firstEvent] = parsedEvents;
  const paymentAddedEvent = parsedEvents.find(
    (event) => event?.name === ColonyAndExtensionsEvents.PaymentAdded,
  );
  const payoutClaimedEvent = parsedEvents.find(
    (event) => event?.name === ColonyAndExtensionsEvents.PayoutClaimed,
  );
  if (
    firstEvent.name === ColonyAndExtensionsEvents.OneTxPaymentMade &&
    !!paymentAddedEvent &&
    !!payoutClaimedEvent
  ) {
    return ColonyActions.Payment;
  }
  if (
    firstEvent.name ===
    ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots
  ) {
    return ColonyActions.MoveFunds;
  }
  return ColonyActions.Generic;
};

export const getAllAvailableClients = async (
  colonyAddress?: Address,
  colonyManager?: ColonyManagerClass,
) => {
  if (colonyAddress && colonyManager) {
    return (
      await Promise.all(
        Object.values(ClientType).map(async (clientType) => {
          try {
            return await colonyManager.getClient(clientType, colonyAddress);
          } catch (error) {
            return undefined;
          }
        }),
      )
    ).filter((clientType) => !!clientType);
  }
  return [];
};

/*
 * Get the events to list on the action's page, based on a map
 */
export const getEventsForActions = (
  events: ParsedEvent[],
  actionType: ColonyActions,
): ParsedEvent[] => [
  ...(ACTIONS_EVENTS[actionType] as ColonyAndExtensionsEvents[])
    ?.map((event) => events.filter(({ name }) => name === event))
    .flat(),
];
