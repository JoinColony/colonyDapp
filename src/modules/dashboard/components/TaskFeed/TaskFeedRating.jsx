/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { UserRecord } from '~types/UserRecord';

import StarRating from '~core/StarRating';
import UserAvatar from '~core/UserAvatar';

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

type Props = {
  rater: UserRecord,
  ratee: UserRecord,
  rating: number,
};

const displayName = 'TaskFeedRating';

const TaskFeedRating = ({
  rater: {
    avatar: raterAvatar,
    displayName: raterDisplayName,
    username: raterUserName,
    walletAddress: raterWalletAddress,
  },
  ratee: { displayName: rateeDisplayName },
  rating,
}: Props) => (
  <div className={styles.main}>
    <div className={styles.ratingPart}>
      <UserAvatar
        avatarUrl={raterAvatar}
        displayName={raterDisplayName}
        size="s"
        username={raterUserName}
        walletAddress={raterWalletAddress}
        hasUserInfo
      />
    </div>
    <div className={styles.ratingPart}>
      <FormattedMessage
        {...MSG.actionRatedText}
        values={{
          rater: raterDisplayName,
          ratee: rateeDisplayName,
          rating,
        }}
      >
        {translatedContent => (
          <div className={styles.ratingPartText}>{translatedContent}</div>
        )}
      </FormattedMessage>
    </div>
    <div className={styles.ratingPart}>
      <StarRating rating={rating} />
    </div>
  </div>
);

TaskFeedRating.displayName = displayName;

export default TaskFeedRating;
