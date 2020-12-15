import { ColonyClient, ClientType } from '@colony/colony-js';
import { BigNumberish, bigNumberify } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';

import ColonyManagerClass from '~lib/ColonyManager';
import {
  ColonyActions,
  ColonyAndExtensionsEvents,
  Address,
} from '~types/index';
import { ParsedEvent } from '~data/index';
import { ProcessedEvent } from '~data/resolvers/colonyActions';

import {
  ACTIONS_EVENTS,
  EVENTS_REQUIRED_FOR_ACTION,
} from '~dashboard/ActionsPage';

interface ActionValues {
  recipient: Address;
  amount: string;
  tokenAddress: Address;
  fromDomain: number;
  toDomain: number;
}

export const getDomainId = async (
  fundingPotId: BigNumberish,
  colonyClient?: ColonyClient,
) => colonyClient?.getDomainFromFundingPot(fundingPotId);

/*
 * Main logic for detecting a action type based on an array of "required" events
 */
export const getActionType = (
  processedEvents: ProcessedEvent[],
): ColonyActions => {
  const potentialActions = {};
  Object.values(EVENTS_REQUIRED_FOR_ACTION).map(
    (eventsWithPositions, index) => {
      /*
       * Filter the events by just the "required" ones
       */
      const filteredParsedEvents = processedEvents.filter(({ name }) =>
        eventsWithPositions?.includes(name),
      );
      /*
       * Add to the potential actions object, both the key
       * and the reduced truthy/falsy value
       */
      potentialActions[
        Object.keys(EVENTS_REQUIRED_FOR_ACTION)[index]
      ] = eventsWithPositions
        ?.map((eventName, eventIndex) => {
          /*
           * Check the existance of the event
           */
          if (filteredParsedEvents[eventIndex]) {
            /*
             * Check the correct position in the events chain
             */
            return filteredParsedEvents[eventIndex].name === eventName;
          }
          return false;
        })
        /*
         * Reduce the array of boleans to a single value
         */
        .every((event) => !!event);
      return null;
    },
  );
  /*
   * Check if we have a possible action (the first object key that is true)
   */
  const [potentialAction] = Object.keys(potentialActions).filter(
    (actionName) => potentialActions[actionName],
  );
  return (potentialAction as ColonyActions) || ColonyActions.Generic;
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
  ...((ACTIONS_EVENTS[actionType] as ColonyAndExtensionsEvents[]) || [])
    ?.map((event) => events.filter(({ name }) => name === event))
    .flat(),
];

export const getPaymentActionValues = async (
  processedEvents: ProcessedEvent[],
  colonyClient: ColonyClient,
): Promise<Partial<ActionValues>> => {
  /*
   * Get the additional events to fetch values from
   *
   * We don't have to worry about these events existing, as long as this
   * is an action event, these events will exist
   */
  const paymentAddedEvent = processedEvents.find(
    (event) => event?.name === ColonyAndExtensionsEvents.PaymentAdded,
  ) as ProcessedEvent;
  const payoutClaimedEvent = processedEvents.find(
    (event) => event?.name === ColonyAndExtensionsEvents.PayoutClaimed,
  ) as ProcessedEvent;
  /*
   * Get the payment details from the payment id
   */
  const { paymentId } = paymentAddedEvent?.values;
  const paymentDetails = await colonyClient.getPayment(paymentId);
  const fromDomain = bigNumberify(paymentDetails?.domainId || 1).toNumber();
  const recipient = paymentDetails?.recipient || AddressZero;
  /*
   * Fetch the values that are present directly in the events values
   */
  const { amount: paymentAmount, token } = payoutClaimedEvent?.values;
  const amount = bigNumberify(paymentAmount || '0').toString();
  const tokenAddress = token || AddressZero;

  return {
    amount,
    tokenAddress,
    fromDomain,
    recipient,
  };
};

export const getActionValues = async (
  processedEvents: ProcessedEvent[],
  colonyClient: ColonyClient,
  actionType: ColonyActions,
): Promise<ActionValues> => {
  const fallbackValues = {
    recipient: AddressZero,
    fromDomain: 1,
    toDomain: 1,
    amount: '0',
    tokenAddress: AddressZero,
  };
  switch (actionType) {
    case ColonyActions.Payment: {
      const paymentActionValues = await getPaymentActionValues(
        processedEvents,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...paymentActionValues,
      };
    }
    default: {
      return fallbackValues;
    }
  }
};
