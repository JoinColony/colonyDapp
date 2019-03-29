/* @flow */

import type { ColonyType, NetworkProps } from '~immutable';

/*
 * Colony
 */
export const isInRecoveryMode = (colony: ?ColonyType) =>
  !!(colony && colony.inRecoveryMode);

export const canBeUpgraded = (colony: ?ColonyType, network: ?NetworkProps) =>
  colony &&
  colony.version &&
  network &&
  network.version &&
  network.version > colony.version;
