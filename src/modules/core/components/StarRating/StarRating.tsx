import React from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~core/Icon';
import styles from './StarRating.css';

const MSG = defineMessages({
  starCountTitle: {
    id: 'StarRating.starCountTitle',
    defaultMessage: `{rating} out of {highestPossible} {highestPossible, plural,
      one {star}
      other {stars}
    }`,
  },
  starIconTitle: {
    id: 'StarRating.starIconTitle',
    defaultMessage: 'Star',
  },
});

interface Props {
  /** Highest possible rating. Must be greater than the value passed to the `rating` prop */
  highestPossible?: number;

  /** Number of stars awarded (out of `highestPossible`) */
  rating: number;
}

const displayName = 'StarRating';

const StarRating = ({ highestPossible = 3, rating }: Props) => (
  <>
    {[...Array(highestPossible).keys()]
      .map(val => val + 1)
      .map(possibleValue => (
        <Icon
          key={`star-rating-${possibleValue}`}
          name="star"
          title={MSG.starCountTitle}
          titleValues={{
            rating,
            highestPossible,
          }}
          className={
            rating >= possibleValue
              ? styles.ratingStarSelected
              : styles.ratingStarUnselected
          }
        />
      ))}
  </>
);

StarRating.displayName = displayName;

export default StarRating;
