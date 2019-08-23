import { useMemo } from 'react';

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
