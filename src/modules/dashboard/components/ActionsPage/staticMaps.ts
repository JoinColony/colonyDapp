import { ColonyRole } from '@colony/colony-js';
import { ColonyAndExtensionsEvents, ColonyActions } from '~types/index';

import { STATUS } from './types';

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

export const ACTION_TYPES_ICONS_MAP: { [key in ColonyActions]: string } = {
  [ColonyActions.Payment]: 'emoji-dollar-stack',
  [ColonyActions.Recovery]: 'emoji-alarm-lamp',
  [ColonyActions.MoveFunds]: 'emoji-world-globe',
  [ColonyActions.Generic]: 'circle-check-primary',
};

export const STATUS_MAP = {
  0: STATUS.Failed,
  1: STATUS.Succeeded,
  2: STATUS.Pending,
};
