/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TaskFeedItemRatingType } from '~immutable';

import StarRating from '~core/StarRating';
import UserAvatarFactory from '~core/UserAvatar';

import styles from './TaskFeedRating.css';

const MSG = defineMessages({
  actionRatedText: {
    id: 'dashboard.TaskFeed.TaskFeedRating.actionRatedText',
    defaultMessage: `{rater} rated {ratee} with {rating} {rating, plural,
      one {star}
      other {stars}
    }`,
  },
});

const UserAvatar = UserAvatarFactory({ showInfo: true });

type Props = {|
  rating: TaskFeedItemRatingType,
|};

const displayName = 'dashboard.TaskFeed.TaskFeedRating';

const TaskFeedRating = ({
  rating: {
    rater: {
      profile: {
        displayName: raterDisplayName,
        walletAddress: raterWalletAddress,
      },
    },
    rater,
    ratee: {
      profile: { displayName: rateeDisplayName },
    },
    rating,
  },
}: Props) => (
  <div className={styles.main}>
    <div className={styles.ratingPart}>
      <UserAvatar address={raterWalletAddress} user={rater} size="xs" />
    </div>
    <div className={styles.ratingPart}>
      <div className={styles.ratingPartText}>
        <FormattedMessage
          {...MSG.actionRatedText}
          values={{
            rater: <span className={styles.userPart}>{raterDisplayName}</span>,
            ratee: <span className={styles.userPart}>{rateeDisplayName}</span>,
            rating,
          }}
        />
      </div>
    </div>
    <div className={styles.ratingPart}>
      <StarRating rating={rating} />
    </div>
  </div>
);

TaskFeedRating.displayName = displayName;

export default TaskFeedRating;
