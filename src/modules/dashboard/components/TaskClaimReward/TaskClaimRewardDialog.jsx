/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import nanoid from 'nanoid';

import type { Props as TaskClaimRewardProps } from './TaskClaimReward.jsx';

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
  claimReward: {
    id: 'dashboard.TaskClaimRewardDialog.claimReward',
    defaultMessage: 'Claim Your Rewards',
  },
  yourReward: {
    id: 'dashboard.TaskClaimRewardDialog.yourReward',
    defaultMessage: 'Your Reward',
  },
  networkFee: {
    id: 'dashboard.TaskClaimRewardDialog.networkFee',
    defaultMessage: '1% Network Fee',
  },
  total: {
    id: 'dashboard.TaskClaimRewardDialog.total',
    defaultMessage: 'Total',
  },
  noRewardsTitle: {
    id: 'dashboard.TaskClaimRewardDialog.noRewardsTitle',
    defaultMessage: 'What does it mean?',
  },
  noRewardsDescription: {
    id: 'dashboard.TaskClaimRewardDialog.noRewardsDescription',
    defaultMessage: `
      You have been rated {oneStarRating}. This means you have failed to submit
      work that meets the task requirements. You will not receive any tokens
      and your reputation has been penalized.
    `,
  },
  oneStarRating: {
    id: 'dashboard.TaskClaimRewardDialog.oneStarRating',
    defaultMessage: 'one star',
  },
});

type Props = {
  cancel: () => void,
  close: () => void,
} & TaskClaimRewardProps;

const displayName = 'dashboard.TaskClaimRewardDialog';

const TaskClaimRewardDialog = ({
  cancel,
  close,
  taskReward: {
    workerRating: rating,
    reputationEarned: reputation,
    payoutsEarned,
  },
  taskTitle,
  sortedPayouts,
  nativeTokenPayout,
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
      {nativeTokenPayout &&
        nativeTokenPayout.symbol && (
          <section className={styles.earnedReputation}>
            <p className={styles.starRatingDescription}>
              <FormattedMessage {...MSG.yourReputation} />
              {rating === 3 && (
                <span className={styles.earnedReputationDetails}>
                  <FormattedMessage
                    {...MSG.reputationDetails}
                    values={{ rating }}
                  />
                </span>
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
                prefix={rating === 1 ? '- ' : ''}
                suffix=" REP"
              />
            </div>
          </section>
        )}
    </DialogSection>
    {(rating === 2 || rating === 3) && payoutsEarned.length ? (
      <DialogSection>
        <Heading appearance={{ size: 'medium' }} text={MSG.claimReward} />
        <section className={styles.rewards}>
          {/*
            * Rewards
            */}
          <div className={styles.rewardItem}>
            <p className={styles.rewardItemDescription}>
              <FormattedMessage {...MSG.yourReward} />
            </p>
            <span className={styles.rewardItemValue}>
              {nativeTokenPayout && (
                <Numeral
                  value={nativeTokenPayout.amount}
                  suffix={` ${nativeTokenPayout.symbol}`}
                />
              )}
              {sortedPayouts.map(({ amount, symbol }, index) => (
                <Numeral
                  key={nanoid(index)}
                  value={amount}
                  suffix={` ${symbol}`}
                />
              ))}
            </span>
          </div>
          {/*
            * Network Fee
            */}
          <div className={styles.rewardItem}>
            <p className={styles.rewardItemDescription}>
              <FormattedMessage {...MSG.networkFee} />
            </p>
            <span className={styles.rewardItemValue}>
              {nativeTokenPayout && (
                <Numeral
                  value={nativeTokenPayout.networkFee}
                  prefix="- "
                  suffix={` ${nativeTokenPayout.symbol}`}
                />
              )}
              {sortedPayouts.map(({ networkFee, symbol }, index) => (
                <Numeral
                  key={nanoid(index)}
                  value={networkFee}
                  prefix="- "
                  suffix={` ${symbol}`}
                />
              ))}
            </span>
          </div>
          {/*
            * Totals
            */}
          <div className={styles.total}>
            <p className={styles.rewardItemDescription}>
              <FormattedMessage {...MSG.total} />
            </p>
            <span className={styles.rewardItemValue}>
              {nativeTokenPayout && (
                <Numeral
                  value={
                    nativeTokenPayout.amount - nativeTokenPayout.networkFee
                  }
                  suffix={` ${nativeTokenPayout.symbol}`}
                />
              )}
              {sortedPayouts.map(({ amount, networkFee, symbol }, index) => (
                <Numeral
                  key={nanoid(index)}
                  value={amount - networkFee}
                  suffix={` ${symbol}`}
                />
              ))}
            </span>
          </div>
        </section>
      </DialogSection>
    ) : null}
    {rating === 1 && (
      <DialogSection>
        <Heading appearance={{ size: 'medium' }} text={MSG.noRewardsTitle} />
        <FormattedMessage
          {...MSG.noRewardsDescription}
          values={{
            oneStarRating: (
              <span className={styles.oneStarRating}>
                <FormattedMessage {...MSG.oneStarRating} />
              </span>
            ),
          }}
        />
      </DialogSection>
    )}
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
