import { bigNumberify } from 'ethers/utils';

export enum ZeroValue {
  Zero = '0',
  NearZero = '~0',
}

export type PercentageReputationType = ZeroValue | number | null;

export const calculatePercentageReputation = (
  decimalPlaces: number,
  userReputation?: string,
  totalReputation?: string,
): PercentageReputationType => {
  if (!userReputation || !totalReputation) return null;
  const userReputationNumber = bigNumberify(userReputation);
  const totalReputationNumber = bigNumberify(totalReputation);

  const reputationSafeguard = bigNumberify(100).pow(decimalPlaces);

  if (userReputationNumber.isZero()) {
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

export const DECIMAL_PLACES = 2;
