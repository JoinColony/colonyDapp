import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TaskRatingType } from '~immutable/index';
import StarRating from '~core/StarRating';
import HookedUserAvatar from '~users/HookedUserAvatar';

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

const UserAvatar = HookedUserAvatar();

interface Props {
  rating: TaskRatingType;
}

const displayName = 'dashboard.TaskFeed.TaskFeedRating';

// @TODO: Use the actual friendly names of rater and ratee (get users)
const TaskFeedRating = ({ rating: { rater, ratee, rating } }: Props) => (
  <div className={styles.main}>
    <div className={styles.ratingPart}>
      <UserAvatar address={rater} showInfo showLink size="xs" />
    </div>
    <div className={styles.ratingPart}>
      <div className={styles.ratingPartText}>
        <FormattedMessage
          {...MSG.actionRatedText}
          values={{
            rater: <span className={styles.userPart}>{rater}</span>,
            ratee: <span className={styles.userPart}>{ratee}</span>,
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
