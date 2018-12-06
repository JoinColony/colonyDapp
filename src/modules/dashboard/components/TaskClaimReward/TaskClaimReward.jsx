/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogActionButton } from '~core/Button';

import type { TaskPayout } from '~types/';

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
  colonyIdentifier: string,
  rating: number,
  reputation: number,
  payouts: Array<TaskPayout>,
  title: string,
  lateRating: boolean,
  lateReveal: boolean,
  sortedPayouts: Array<Object>,
  nativeTokenPayout: Object | void,
};

const displayName = 'dashboard.TaskClaimReward';

const TaskClaimReward = ({
  taskId,
  colonyIdentifier,
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
      colonyIdentifier,
      tokenAddresses: payouts.map(payout => payout.address),
    }}
  />
);

TaskClaimReward.displayName = displayName;

export default TaskClaimReward;
