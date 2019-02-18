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
  taskId: number,
  colonyENSName: string,
  rating: number,
  reputation: number,
  payouts: Array<TaskPayoutType>,
  title: string,
  lateRating: boolean,
  lateReveal: boolean,
  sortedPayouts: Array<TaskPayoutType>,
  nativeTokenPayout: Object | void,
};

const displayName = 'dashboard.TaskClaimReward';

const TaskClaimReward = ({
  taskId,
  colonyENSName,
  rating,
  reputation,
  payouts,
  title,
  lateRating,
  lateReveal,
  sortedPayouts,
  nativeTokenPayout,
}: Props) => (
  <DialogActionButton
    text={MSG.claimRewards}
    dialog="TaskClaimRewardDialog"
    dialogProps={{
      rating,
      reputation,
      payouts,
      title,
      lateRating,
      lateReveal,
      sortedPayouts,
      nativeTokenPayout,
    }}
    submit={ACTIONS.TASK_WORKER_CLAIM_REWARD}
    success={ACTIONS.TASK_WORKER_CLAIM_REWARD_SUCCESS}
    error={ACTIONS.TASK_WORKER_CLAIM_REWARD_ERROR}
    values={{
      taskId,
      colonyENSName,
      tokenAddresses: payouts.map(payout => payout.token.address),
    }}
  />
);

TaskClaimReward.displayName = displayName;

export default TaskClaimReward;
