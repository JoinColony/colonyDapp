import { ColonyRole } from '@colony/colony-js';
import { ColonyAndExtensionsEvents } from '~types/index';

type EventRolesMap = Partial<
  {
    [key in ColonyAndExtensionsEvents]: ColonyRole[];
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
  [ColonyAndExtensionsEvents.Generic]: [],
};
