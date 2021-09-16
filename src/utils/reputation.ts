import { bigNumberify } from 'ethers/utils';

export enum ZeroValue {
  Zero = '0',
  NearZero = '~0',
}

export type PercentageReputationType = ZeroValue | number | null;

export const DECIMAL_PLACES = 2;

export const calculatePercentageReputation = (
  userReputation?: string,
  totalReputation?: string,
  decimalPlaces = DECIMAL_PLACES,
): PercentageReputationType => {
  if (!userReputation || !totalReputation) return null;
  const userReputationNumber = bigNumberify(userReputation);
  const totalReputationNumber = bigNumberify(totalReputation);

  const reputationSafeguard = bigNumberify(100).pow(decimalPlaces);

  if (userReputationNumber.isZero() || totalReputationNumber.isZero()) {
    return ZeroValue.Zero;
  }

  if (userReputationNumber.mul(reputationSafeguard).lt(totalReputationNumber)) {
    return ZeroValue.NearZero;
  }

  const reputation = userReputationNumber
    .mul(reputationSafeguard)
    .div(totalReputationNumber)
    .toNumber();

  return reputation / 10 ** decimalPlaces;
};
