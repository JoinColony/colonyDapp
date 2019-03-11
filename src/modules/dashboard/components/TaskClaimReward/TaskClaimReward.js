/* @flow */

import { compose, withProps } from 'recompose';

import { sortObjectsBy } from '~utils/arrays';

import type { TaskType } from '~immutable';

import TaskClaimReward from './TaskClaimReward.jsx';

export type Props = {|
  task: TaskType,
|};

const isEth = (prev: boolean, next: boolean): number => {
  if (prev || next) {
    return prev ? -1 : 1;
  }
  return 0;
};

// Mirrors contract `getReputation`
const getReputation = (
  reputation: number,
  rating: number,
  rateFail: boolean,
) => {
  const ratingMultipliers = [-2, 2, 3];
  const ratingDivisor = 2;
  return (
    (reputation * ratingMultipliers[rating - 1] - (rateFail ? reputation : 0)) /
    ratingDivisor
  );
};

const enhance = compose(
  withProps(
    ({
      task: {
        draftId,
        colonyENSName,
        payouts,
        workerHasRated,
        workerRateFail,
        // This will always be set, default to appease the type gods
        workerRating: rating = 0,
        reputation,
        title,
      },
    }: Props) => ({
      draftId,
      colonyENSName,
      rating,
      reputation: getReputation(reputation, rating, workerRateFail),
      payouts,
      title,
      lateRating: !workerHasRated,
      lateReveal: !!workerHasRated && workerRateFail,
      sortedPayouts: payouts
        /*
         * Take out the native token
         */
        .filter(payout => !payout.token.isNative)
        /*
         * Sort ETH to the top
         */
        .sort(sortObjectsBy({ name: 'isEth', compareFn: isEth }, 'token')),
      nativeTokenPayout: payouts
        /*
         * See if we have a native token
         */
        .find(payout => payout.token.isNative),
    }),
  ),
);

export default enhance(TaskClaimReward);
