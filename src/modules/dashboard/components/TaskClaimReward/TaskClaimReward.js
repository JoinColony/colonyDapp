/* @flow */

import { compose, withProps } from 'recompose';

import { sortObjectsBy } from '~utils/arrays';

import type { TaskRecord, TaskPayout } from '~types/';

import TaskClaimReward from './TaskClaimReward.jsx';

export type Props = {
  task: TaskRecord,
};

const isNative = (payout: TaskPayout): boolean => !!payout.isNative;

const isEth = (prev: boolean, next: boolean): number => {
  if (prev || next) {
    return prev ? -1 : 1;
  }
  return 0;
};

const networkFee = (payout: TaskPayout): TaskPayout => ({
  ...payout,
  networkFee: payout.amount * 0.01,
});

// TODO: in the future use contract `getReputation`
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
        id: taskId,
        colonyIdentifier,
        payouts,
        workerHasRated,
        workerRateFail,
        // TODO: rating should not have a default
        workerRating: rating = 2,
        reputation,
        title,
      },
    }: Props) => ({
      taskId,
      colonyIdentifier,
      rating,
      reputation: getReputation(reputation, rating, workerRateFail),
      payouts,
      title,
      lateRating: !workerHasRated,
      lateReveal: !!workerHasRated && workerRateFail,
      sortedPayouts: payouts
        /*
         * Calculate the network fee
         */
        .map(networkFee)
        /*
         * Take out the native token
         */
        .filter(payout => !isNative(payout))
        /*
         * Sort ETH to the top
         */
        .sort(sortObjectsBy({ name: 'isEth', compareFn: isEth }, 'symbol')),
      nativeTokenPayout: payouts
        /*
         * See if we have a native token
         */
        .find(isNative),
    }),
  ),
);

export default enhance(TaskClaimReward);
