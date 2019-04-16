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
      task: { draftId, colonyAddress, payouts, reputation, title },
    }: Props) => {
      // TODO get these from a TaskUser record (in state)
      const { didRate, didFailToRate, rating = 0 } = {};

      return {
        draftId,
        colonyAddress,
        rating,
        reputation: getReputation(reputation, rating, didFailToRate),
        payouts,
        title,
        lateRating: !didRate,
        lateReveal: !!didRate && didFailToRate,
        sortedPayouts: payouts
          /*
           * Take out the native token
           */
          // $FlowFixMe this should be from TokenReference
          .filter(payout => !payout.token.isNative)
          /*
           * Sort ETH to the top
           */
          .sort(sortObjectsBy({ name: 'isEth', compareFn: isEth }, 'token')),
        nativeTokenPayout: payouts
          /*
           * See if we have a native token
           */
          // $FlowFixMe this should be from TokenReference
          .find(payout => payout.token.isNative),
      };
    },
  ),
);

export default enhance(TaskClaimReward);
