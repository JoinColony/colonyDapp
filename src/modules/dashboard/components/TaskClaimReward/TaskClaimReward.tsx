import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogActionButton } from '~core/Button';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { AnyTask, Payouts } from '~data/index';

import TaskClaimRewardDialog from './TaskClaimRewardDialog';

const MSG = defineMessages({
  claimRewards: {
    id: 'dashboard.TaskClaimReward.claimRewards',
    defaultMessage: 'Claim Rewards',
  },
});

export interface Props {
  colonyAddress: Address;
  draftId: AnyTask['id'];
  lateRating: boolean;
  lateReveal: boolean;
  nativeTokenPayout: object | void;
  payouts: Payouts;
  rating: number;
  reputation: number;
  sortedPayouts: Payouts;
  title?: string;
}

const displayName = 'dashboard.TaskClaimReward';

const TaskClaimReward = ({
  colonyAddress,
  draftId,
  lateRating,
  lateReveal,
  nativeTokenPayout,
  payouts,
  rating,
  sortedPayouts,
  title,
}: Props) => (
  <DialogActionButton
    text={MSG.claimRewards}
    dialog={TaskClaimRewardDialog}
    dialogProps={{
      task: {
        title,
        rating,
        lateRating,
        lateReveal,
        sortedPayouts,
        nativeTokenPayout,
      },
    }}
    submit={ActionTypes.TASK_WORKER_CLAIM_REWARD}
    success={ActionTypes.TASK_WORKER_CLAIM_REWARD_SUCCESS}
    error={ActionTypes.TASK_WORKER_CLAIM_REWARD_ERROR}
    values={{
      draftId,
      colonyAddress,
      tokenAddresses: payouts.map(payout => payout.token.address),
    }}
  />
);

TaskClaimReward.displayName = displayName;

export default TaskClaimReward;
