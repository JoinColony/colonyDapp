/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { List } from 'immutable';

import { DialogActionButton } from '~core/Button';

import type { TaskPayoutRecord } from '~immutable';

import {
  TASK_WORKER_CLAIM_REWARD,
  TASK_WORKER_CLAIM_REWARD_ERROR,
  TASK_WORKER_CLAIM_REWARD_SUCCESS,
} from '../../actionTypes';

const MSG = defineMessages({
  claimRewards: {
    id: 'dashboard.TaskClaimReward.claimRewards',
    defaultMessage: 'Claim Rewards',
  },
});

export type Props = {
  taskId: number,
  colonyENSName: string,
  rating: number,
  reputation: number,
  payouts: List<TaskPayoutRecord>,
  title: string,
  lateRating: boolean,
  lateReveal: boolean,
  sortedPayouts: List<Object>,
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
    submit={TASK_WORKER_CLAIM_REWARD}
    success={TASK_WORKER_CLAIM_REWARD_SUCCESS}
    error={TASK_WORKER_CLAIM_REWARD_ERROR}
    values={{
      taskId,
      colonyENSName,
      tokenAddresses: payouts.map(payout => payout.token.address),
    }}
  />
);

TaskClaimReward.displayName = displayName;

export default TaskClaimReward;
