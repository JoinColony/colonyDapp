/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';

import styles from './TaskClaimRewardDialog.css';

const MSG = defineMessages({
  yourRating: {
    id: 'dashboard.TaskClaimRewardDialog.yourRating',
    defaultMessage: 'You were rated',
  },
  yourReputation: {
    id: 'dashboard.TaskClaimRewardDialog.yourReputation',
    defaultMessage: 'Your earned reputation',
  },
  reputationDetails: {
    id: 'dashboard.TaskClaimRewardDialog.reputationDetails',
    defaultMessage: `{rating, select,
      3 {You earned a 1.5x reputation bonus!}
      1 {Your received a reputation penalty for a 1 star rating.}
    }`,
  },
  reputationPenalty: {
    id: 'dashboard.TaskClaimRewardDialog.reputationPenalty',
    defaultMessage: `You were penalized for not {ratedOnTime, select,
      true {rating}
      other {revealing}
    } on time.`,
  },
});

type Props = {
  cancel: () => void,
  close: () => void,
  taskReward: Object,
  taskTitle: string,
  nativeTokenSymbol: string,
};

const displayName = 'dashboard.TaskClaimRewardDialog';

const TaskClaimRewardDialog = ({
  cancel,
  close,
  taskReward: { workerRating: rating, reputationEarned: reputation },
  taskTitle,
  nativeTokenSymbol,
}: Props) => (
  <Dialog cancel={cancel} className={styles.main}>
    <DialogSection appearance={{ border: 'bottom' }}>
      <Heading appearance={{ size: 'medium' }} text={taskTitle} />
      <section className={styles.starRating}>
        <p className={styles.starRatingDescription}>
          <FormattedMessage {...MSG.yourRating} />
        </p>
        <div className={styles.stars}>
          {/*
           * @NOTE No logic has been applied to the rating icons
           *
           * This is because #556 adds a core `StarRating` component which will
           * replace this (and has the rating logic built it)
           *
           * Tip: use `taskReward.rating` for this
           */}
          <Icon
            name="star"
            title="star"
            appearance={{ size: 'tiny', theme: 'primary' }}
          />
          <Icon
            name="star"
            title="star"
            appearance={{ size: 'tiny', theme: 'primary' }}
          />
          <Icon
            name="star"
            title="star"
            appearance={{ size: 'tiny', theme: 'primary' }}
          />
        </div>
      </section>
      <section className={styles.earnedReputation}>
        <p className={styles.starRatingDescription}>
          <FormattedMessage {...MSG.yourReputation} />
          {rating === 3 && (
            <p className={styles.earnedReputationDetails}>
              <FormattedMessage
                {...MSG.reputationDetails}
                values={{ rating }}
              />
            </p>
          )}
          {rating === 1 && (
            <p className={styles.earnedReputationPenalty}>
              <FormattedMessage
                {...MSG.reputationDetails}
                values={{ rating }}
              />
            </p>
          )}
          {rating !== 3 &&
            rating !== 1 && (
              <p className={styles.earnedReputationPenalty}>
                <FormattedMessage
                  {...MSG.reputationPenalty}
                  values={{ ratedOnTime: true }}
                />
              </p>
            )}
        </p>
        <div className={styles.reputationValue}>
          <Numeral
            value={reputation}
            suffix=" REP"
            appearance={{ size: 'medium', theme: 'primary' }}
          />
        </div>
      </section>
    </DialogSection>
    <DialogSection appearance={{ align: 'right' }}>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={cancel}
        text={{ id: 'button.cancel' }}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        text={{ id: 'button.continue' }}
        onClick={() => {
          /* eslint-disable-next-line no-console */
          console.log(`[${displayName}]`, 'Claimed that sweet, sweet reward!');
          return close();
        }}
      />
    </DialogSection>
  </Dialog>
);

TaskClaimRewardDialog.displayName = displayName;

export default TaskClaimRewardDialog;
