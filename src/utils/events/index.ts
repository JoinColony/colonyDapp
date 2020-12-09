import { BigNumberish } from 'ethers/utils';
import { ColonyClient } from '@colony/colony-js';

import { ColonyActions, ColonyAndExtensionsEvents } from '~types/index';

export const getPaymentDetails = async (
  paymentId: BigNumberish,
  colonyClient?: ColonyClient,
) => colonyClient?.getPayment(paymentId);

export const getActionType = (parsedEvents) => {
  if (!parsedEvents || !parsedEvents.length) {
    return ColonyActions.Generic;
  }
  const [firstEvent] = parsedEvents;
  if (firstEvent.name === ColonyAndExtensionsEvents.OneTxPaymentMade) {
    return ColonyActions.Payment;
  }
  return ColonyActions.Generic;
};
