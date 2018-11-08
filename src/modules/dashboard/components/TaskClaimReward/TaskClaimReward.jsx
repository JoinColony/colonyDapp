/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { DialogType } from '~core/Dialog';

import withDialog from '~core/Dialog/withDialog';
import Button from '~core/Button';

const MSG = defineMessages({
  claimRewards: {
    id: 'dashboard.TaskClaimReward.claimRewards',
    defaultMessage: 'Claim Rewards',
  },
});

const displayName = 'dashboard.TaskClaimReward';

type Props = {
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
};

const TaskClaimReward = ({ openDialog }: Props) => (
  <Button
    text={MSG.claimRewards}
    onClick={() => openDialog('TaskClaimRewardDialog')}
  />
);

TaskClaimReward.displayName = displayName;

export default withDialog()(TaskClaimReward);
