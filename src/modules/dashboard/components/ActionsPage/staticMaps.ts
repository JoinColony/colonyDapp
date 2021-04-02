import { ColonyRole } from '@colony/colony-js';
import { ColonyAndExtensionsEvents, ColonyActions, ColonyMotions } from '~types/index';

import { STATUS } from './types';

export enum ActionPageDetails {
  FromDomain = 'FromDomain',
  ToDomain = 'ToDomain',
  ToRecipient = 'ToRecipient',
  Amount = 'Amount',
  Domain = 'Domain',
  Description = 'Description',
  Name = 'Name',
  Permissions = 'Permissions',
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
    [key in ColonyActions]: ActionPageDetails[];
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
  [ColonyAndExtensionsEvents.DomainAdded]: [ColonyRole.Architecture],
  [ColonyAndExtensionsEvents.ColonyUpgraded]: [ColonyRole.Root],
  [ColonyAndExtensionsEvents.ColonyMetadata]: [ColonyRole.Root],
  [ColonyAndExtensionsEvents.DomainMetadata]: [ColonyRole.Architecture],
  [ColonyAndExtensionsEvents.ColonyRoleSet]: [ColonyRole.Architecture],
  [ColonyAndExtensionsEvents.RecoveryModeEntered]: [ColonyRole.Recovery],
  [ColonyAndExtensionsEvents.RecoveryStorageSlotSet]: [ColonyRole.Recovery],
  [ColonyAndExtensionsEvents.RecoveryModeExitApproved]: [ColonyRole.Recovery],
  [ColonyAndExtensionsEvents.RecoveryModeExited]: [ColonyRole.Recovery],
  [ColonyAndExtensionsEvents.Generic]: [],
};

/*
 * Which icons correspond to which action types in the details widget
 */
export const ACTION_TYPES_ICONS_MAP: { [key in ColonyActions]: string } = {
  [ColonyActions.WrongColony]: 'forbidden-signal',
  [ColonyActions.Payment]: 'emoji-dollar-stack',
  [ColonyActions.Recovery]: 'emoji-alarm-lamp',
  [ColonyActions.MoveFunds]: 'emoji-world-globe',
  [ColonyActions.MintTokens]: 'emoji-seed-sprout',
  [ColonyActions.CreateDomain]: 'emoji-crane',
  [ColonyActions.VersionUpgrade]: 'emoji-strong-person',
  [ColonyActions.ColonyEdit]: 'emoji-edit-tools',
  [ColonyActions.EditDomain]: 'emoji-pencil-note',
  [ColonyActions.SetUserRoles]: 'emoji-crane',
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
  [ColonyActions.CreateDomain]: [ColonyAndExtensionsEvents.DomainAdded],
  [ColonyActions.VersionUpgrade]: [ColonyAndExtensionsEvents.ColonyUpgraded],
  [ColonyActions.ColonyEdit]: [ColonyAndExtensionsEvents.ColonyMetadata],
  [ColonyActions.EditDomain]: [ColonyAndExtensionsEvents.DomainMetadata],
  [ColonyActions.SetUserRoles]: [ColonyAndExtensionsEvents.ColonyRoleSet],
  [ColonyActions.Recovery]: [
    ColonyAndExtensionsEvents.RecoveryModeEntered,
    ColonyAndExtensionsEvents.RecoveryStorageSlotSet,
    ColonyAndExtensionsEvents.RecoveryModeExitApproved,
    ColonyAndExtensionsEvents.RecoveryModeExited,
  ],
  [ColonyMotions.MintTokensMotion]: [ColonyAndExtensionsEvents.MotionCreated]
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
  /*
   * We track both configurations of this action (with metadata and without)
   * This allows us to treat events with just `DomainMetadata` emmited as being
   * the domain edited action
   */
  [ColonyActions.CreateDomain]: [
    ColonyAndExtensionsEvents.DomainMetadata,
    ColonyAndExtensionsEvents.DomainAdded,
  ],
  [ColonyActions.CreateDomain]: [
    // Don't track the metadata event, as not all domains might have it
    ColonyAndExtensionsEvents.DomainAdded,
  ],
  [ColonyActions.VersionUpgrade]: [ColonyAndExtensionsEvents.ColonyUpgraded],
  [ColonyActions.ColonyEdit]: [ColonyAndExtensionsEvents.ColonyMetadata],
  [ColonyActions.EditDomain]: [ColonyAndExtensionsEvents.DomainMetadata],
  [ColonyActions.SetUserRoles]: [ColonyAndExtensionsEvents.ColonyRoleSet],
  [ColonyActions.Recovery]: [ColonyAndExtensionsEvents.RecoveryModeEntered],
};

/*
 * Which details display for which type
 */

export const DETAILS_FOR_ACTION: ActionsDetailsMap = {
  [ColonyActions.Payment]: [
    ActionPageDetails.FromDomain,
    ActionPageDetails.ToRecipient,
    ActionPageDetails.Amount,
  ],
  [ColonyActions.MoveFunds]: [
    ActionPageDetails.FromDomain,
    ActionPageDetails.ToDomain,
    ActionPageDetails.Amount,
  ],
  [ColonyActions.MintTokens]: [ActionPageDetails.Amount],
  [ColonyActions.CreateDomain]: [
    ActionPageDetails.Domain,
    ActionPageDetails.Description,
  ],
  [ColonyActions.ColonyEdit]: [ActionPageDetails.Name],
  [ColonyActions.EditDomain]: [
    ActionPageDetails.Domain,
    ActionPageDetails.Description,
  ],
  [ColonyActions.SetUserRoles]: [
    ActionPageDetails.Domain,
    ActionPageDetails.ToRecipient,
    ActionPageDetails.Permissions,
  ],
  [ColonyActions.Recovery]: [],
};
