import { BigNumberish } from 'ethers/utils';
import { ColonyClient } from '@colony/colony-js';

import { ColonyActions, ColonyAndExtensionsEvents } from '~types/index';

export const getPaymentDetails = async (
  paymentId: BigNumberish,
  colonyClient?: ColonyClient,
) => colonyClient?.getPayment(paymentId);

export const getActiveDomain = async (
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
  return ColonyActions.Generic;
};
