import { ColonyRole, ColonyVersion } from '@colony/colony-js';

import { Colony } from '~data/index';
import { TaskUserType } from '~immutable/index';
import { Address } from '~types/index';
import { hasRoot, canAdminister, canFund } from '../users/checks';

/*
 * Colony
 */
export const canBeUpgraded = (colony?: Colony, networkVersion?: string) =>
  colony?.version &&
  networkVersion &&
  parseInt(networkVersion, 10) > parseInt(colony.version, 10);

export const mustBeUpgraded = (colony?: Colony, networkVersion?: string) =>
  canBeUpgraded(colony, networkVersion) &&
  colony?.version &&
  parseInt(colony.version, 10) < ColonyVersion.LightweightSpaceship;

export const shouldBeUpgraded = (colony?: Colony, networkVersion?: string) =>
  canBeUpgraded(colony, networkVersion) &&
  colony?.version &&
  parseInt(colony.version, 10) >= ColonyVersion.LightweightSpaceship;

export const canRecoverColony = hasRoot;
