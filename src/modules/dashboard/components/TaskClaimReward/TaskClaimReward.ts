import { compose, withProps } from 'recompose';

import { sortObjectsBy } from '~utils/arrays';

import TaskClaimReward from './TaskClaimReward';

export interface Props {
  // @TODO This needs to be fixed
  task: any;
}

const isEth = (prev: boolean, next: boolean): number => {
  if (prev || next) {
    return prev ? -1 : 1;
  }
  return 0;
};

// Mirrors contract `getReputation`
// const getReputation = (
//   reputation: number,
//   rating: number,
//   rateFail: boolean,
// ) => {
//   const ratingMultipliers = [-2, 2, 3];
//   const ratingDivisor = 2;
//   return (
//     (reputation * ratingMultipliers[rating - 1] - (rateFail ? reputation : 0)) /
//     ratingDivisor
//   );
// };

/**
 * @todo Use hooks for `TaskClaimReward` and fix rating props.
 * @body Get the rating props from a TaskUser record (in state)
 */
const enhance = compose(
  withProps(({ task: { id, colonyAddress, title } }: Props) => {
    // @ts-ignore
    const { didRate, didFailToRate, rating = 0 } = {};
    const payouts = [];

    return {
      draftId: id,
      colonyAddress,
      rating,
      reputation: undefined,
      // @TODO get payouts
      payouts,
      title,
      lateRating: !didRate,
      lateReveal: !!didRate && didFailToRate,
      sortedPayouts: payouts
        /*
         * Take out the native token
         */
        // @ts-ignore
        .filter((payout) => !payout.token.isNative)
        /*
         * Sort the current network's Token (ie: ETH, XDAI, etc) to the top
         */
        .sort(sortObjectsBy({ name: 'isEth', compareFn: isEth }, 'token')),
      nativeTokenPayout: payouts
        /*
         * See if we have a native token
         */
        // @ts-ignore
        .find((payout) => payout.token.isNative),
    };
  }),
);

export default enhance(TaskClaimReward);
