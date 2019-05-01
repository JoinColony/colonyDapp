/* @flow */

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import { useMemo } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useReputationEarned = (
  reputation: number,
  rating: number,
  didFailToRate: boolean,
) => {
  const ratingMultipliers = [-2, 2, 3];
  const ratingDivisor = 2;
  return useMemo(
    () =>
      (reputation * ratingMultipliers[rating - 1] -
        (didFailToRate ? reputation : 0)) /
      ratingDivisor,
    [didFailToRate, rating, ratingMultipliers, reputation],
  );
};
