import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import InfoPopover from '~core/InfoPopover';
import StarRating from '~core/StarRating';
import { useUser } from '~data/index';
import { TaskRatingType } from '~immutable/index';
import { Address } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { getFriendlyName } from '../../../users/transformers';

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
  colonyAddress: Address;
  domainId?: number;
  rating: TaskRatingType;
}

const displayName = 'dashboard.TaskFeed.TaskFeedRating';

const TaskFeedRating = ({
  colonyAddress,
  domainId,
  rating: { rater: raterAddress, ratee: rateeAddress, rating },
}: Props) => {
  const rater = useUser(raterAddress);
  const ratee = useUser(rateeAddress);
  const friendlyNameRater = getFriendlyName(rater);
  const friendlyNameRatee = getFriendlyName(ratee);
  return (
    <div className={styles.main}>
      <div className={styles.ratingPart}>
        <UserAvatar
          address={raterAddress}
          colonyAddress={colonyAddress}
          showInfo
          showLink
          size="xs"
        />
      </div>
      <div className={styles.ratingPart}>
        <div className={styles.ratingPartText}>
          <FormattedMessage
            {...MSG.actionRatedText}
            values={{
              rater: (
                <InfoPopover
                  colonyAddress={colonyAddress}
                  domainId={domainId}
                  user={rater}
                >
                  <span className={styles.userPart}>{friendlyNameRater}</span>
                </InfoPopover>
              ),
              ratee: (
                <InfoPopover
                  colonyAddress={colonyAddress}
                  domainId={domainId}
                  user={ratee}
                >
                  <span className={styles.userPart}>{friendlyNameRatee}</span>
                </InfoPopover>
              ),
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
};

TaskFeedRating.displayName = displayName;

export default TaskFeedRating;
