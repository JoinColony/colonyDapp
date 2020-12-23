import { ColonyRole } from '@colony/colony-js';
import { ColonyAndExtensionsEvents, ColonyActions } from '~types/index';

import { STATUS } from './types';

export enum ActionPageDetails {
  fromDomain = 'fromDomain',
  toDomain = 'toDomain',
  toRecipient = 'toRecipient',
  amount = 'amount',
}

type EventRolesMap = Partial<
  {
    [key in ColonyAndExtensionsEvents]: ColonyRole[];
  }
>;

type ActionsEventsMap = Partial<
  {
    [key in ColonyActions]: ColonyAndExtensionsEvents[];
  }
>;

type ActionsDetailsMap = Partial<
  {
    [key in ActionPageDetails]: ColonyActions[];
  }
>;

/*
 * @NOTE Event roles are static, so we just need to create a manual map
 * Containing the actual event, and the role(s)
 */
export const EVENT_ROLES_MAP: EventRolesMap = {
  [ColonyAndExtensionsEvents.OneTxPaymentMade]: [ColonyRole.Administration],
  [ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots]: [
    ColonyRole.Funding,
  ],
  [ColonyAndExtensionsEvents.TokensMinted]: [ColonyRole.Root],
  [ColonyAndExtensionsEvents.Generic]: [],
};

/*
 * Which icons correspond to which action types in the details widget
 */
export const ACTION_TYPES_ICONS_MAP: { [key in ColonyActions]: string } = {
  [ColonyActions.Payment]: 'emoji-dollar-stack',
  [ColonyActions.Recovery]: 'emoji-alarm-lamp',
  [ColonyActions.MoveFunds]: 'emoji-world-globe',
  [ColonyActions.MintTokens]: 'emoji-seed-sprout',
  [ColonyActions.Generic]: 'circle-check-primary',
};

/*
 * Transaction statuses
 */
export const STATUS_MAP: { [key in number]: STATUS } = {
  0: STATUS.Failed,
  1: STATUS.Succeeded,
  2: STATUS.Pending,
};

/*
 * Which events to display on which action's page
 */
export const ACTIONS_EVENTS: ActionsEventsMap = {
  [ColonyActions.Payment]: [ColonyAndExtensionsEvents.OneTxPaymentMade],
  [ColonyActions.MoveFunds]: [
    ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots,
  ],
  [ColonyActions.MintTokens]: [ColonyAndExtensionsEvents.TokensMinted],
};

/*
 * Which events are required to present, and in which order, for a transaction
 * to be of a certain action type
 *
 * **Be Warned**: The position of the events in the array matters!
 */
export const EVENTS_REQUIRED_FOR_ACTION: ActionsEventsMap = {
  [ColonyActions.Payment]: [
    ColonyAndExtensionsEvents.OneTxPaymentMade,
    ColonyAndExtensionsEvents.PayoutClaimed,
    ColonyAndExtensionsEvents.PaymentAdded,
  ],
  [ColonyActions.MoveFunds]: [
    ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots,
  ],
  [ColonyActions.MintTokens]: [ColonyAndExtensionsEvents.TokensMinted],
};

/*
 * Which details display for which type
 */

export const DETAILS_FOR_ACTION: ActionsDetailsMap = {
  [ActionPageDetails.fromDomain]: [
    ColonyActions.Payment,
    ColonyActions.MoveFunds,
  ],
  [ActionPageDetails.toDomain]: [
    ColonyActions.MoveFunds,
  ],
  [ActionPageDetails.toRecipient]: [
    ColonyActions.Payment,
  ],
  [ActionPageDetails.amount]: [
    ColonyActions.Payment,
    ColonyActions.MoveFunds,
    ColonyActions.MintTokens
  ],
};
