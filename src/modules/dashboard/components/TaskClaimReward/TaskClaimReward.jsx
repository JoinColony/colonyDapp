/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogActionButton } from '~core/Button';
import { ACTIONS } from '~redux';

import type { TaskPayoutType } from '~immutable';

const MSG = defineMessages({
  claimRewards: {
    id: 'dashboard.TaskClaimReward.claimRewards',
    defaultMessage: 'Claim Rewards',
  },
});

// Can't seal this object because of HOC
export type Props = {
  colonyAddress: string,
  draftId: string,
  lateRating: boolean,
  lateReveal: boolean,
  nativeTokenPayout: Object | void,
  payouts: Array<TaskPayoutType>,
  rating: number,
  reputation: number,
  sortedPayouts: Array<TaskPayoutType>,
  title?: string,
};

const displayName = 'dashboard.TaskClaimReward';

const TaskClaimReward = ({
  colonyAddress,
  draftId,
  lateRating,
  lateReveal,
  nativeTokenPayout,
  payouts,
  rating,
  reputation,
  sortedPayouts,
  title,
}: Props) => (
  <DialogActionButton
    text={MSG.claimRewards}
    dialog="TaskClaimRewardDialog"
    dialogProps={{
      lateRating,
      lateReveal,
      nativeTokenPayout,
      payouts,
      rating,
      reputation,
      sortedPayouts,
      title,
    }}
    submit={ACTIONS.TASK_WORKER_CLAIM_REWARD}
    success={ACTIONS.TASK_WORKER_CLAIM_REWARD_SUCCESS}
    error={ACTIONS.TASK_WORKER_CLAIM_REWARD_ERROR}
    values={{
      draftId,
      colonyAddress,
      tokenAddresses: payouts.map(payout => payout.token.address),
    }}
  />
);

TaskClaimReward.displayName = displayName;

export default TaskClaimReward;
