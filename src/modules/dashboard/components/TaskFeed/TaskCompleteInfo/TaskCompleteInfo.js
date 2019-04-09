/* @flow */
import type { HOC } from 'recompose';

import { compose, mapProps } from 'recompose';

import type { EnhancedProps } from './types';

import TaskCompleteInfo from './TaskCompleteInfo.jsx';

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

const enhance: HOC<EnhancedProps, *> = compose(
  mapProps(
    ({
      task: {
        reputation,
        worker: { didFailToRate, rating = 0 } = {}, // set defaults to make flow happy
      },
      transaction,
    }) => ({
      reputation: getReputation(reputation, rating, didFailToRate),
      ...transaction,
    }),
  ),
);

export default enhance(TaskCompleteInfo);
