import { ColonyRole, ColonyRoles } from '@colony/colony-js';

import { Address } from '~types/index';

export const canMoveTokens = (
  colonyRoles: ColonyRoles,
  walletAddress: Address,
) =>
  colonyRoles &&
  !!colonyRoles.find(
    (user) =>
      user.address === walletAddress &&
      user.domains.find((domain) => domain.roles.includes(ColonyRole.Funding)),
  );
