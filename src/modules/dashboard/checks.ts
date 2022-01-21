import {
  ColonyVersion,
  Extension,
  OneTxPaymentExtensionVersion,
} from '@colony/colony-js';

import { Colony, ColonyExtension } from '~data/index';
import { hasRoot } from '~modules/users/checks';

/*
 * Colony
 */
export const colonyCanBeUpgraded = (colony?: Colony, networkVersion?: string) =>
  colony?.version &&
  networkVersion &&
  parseInt(networkVersion, 10) > parseInt(colony.version, 10);

export const colonyMustBeUpgraded = (
  colony?: Colony,
  networkVersion?: string,
) =>
  colonyCanBeUpgraded(colony, networkVersion) &&
  colony?.version &&
  parseInt(colony.version, 10) < ColonyVersion.LightweightSpaceship;

export const colonyShouldBeUpgraded = (
  colony?: Colony,
  networkVersion?: string,
) =>
  colonyCanBeUpgraded(colony, networkVersion) &&
  colony?.version &&
  parseInt(colony.version, 10) >= ColonyVersion.LightweightSpaceship;

export const canRecoverColony = hasRoot;

/*
 * Extension
 */

export const oneTxMustBeUpgraded = (extension?: ColonyExtension) => {
  if (extension) {
    const {
      extensionId: extensionName,
      details: { version },
    } = extension;
    return (
      extensionName === Extension.OneTxPayment &&
      version < OneTxPaymentExtensionVersion.DandelionLightweightSpaceship
    );
  }
  return false;
};
