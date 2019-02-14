/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TaskFeedItemRatingType } from '~immutable';

import StarRating from '~components/core/StarRating';
import UserAvatar from '~components/core/UserAvatar';

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

type Props = {|
  rating: TaskFeedItemRatingType,
|};

const displayName = 'dashboard.TaskFeed.TaskFeedRating';

const TaskFeedRating = ({
  rating: {
    rater: {
      profile: {
        avatar: raterAvatar,
        displayName: raterDisplayName,
        username: raterUserName,
        walletAddress: raterWalletAddress,
      },
    },
    ratee: {
      profile: { displayName: rateeDisplayName },
    },
    rating,
  },
}: Props) => (
  <div className={styles.main}>
    <div className={styles.ratingPart}>
      <UserAvatar
        avatarUrl={raterAvatar}
        displayName={raterDisplayName}
        size="xs"
        username={raterUserName}
        walletAddress={raterWalletAddress}
        hasUserInfo
      />
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
