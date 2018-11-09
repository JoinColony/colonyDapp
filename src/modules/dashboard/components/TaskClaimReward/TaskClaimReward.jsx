/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { DialogType } from '~core/Dialog';

import withDialog from '~core/Dialog/withDialog';
import Button from '~core/Button';

/*
 * This should most likely come from the redux state, so we can compare against
 * the tasks's payouts
 */
const MOCK_NATIVE_TOKEN_SYMBOL: string = 'CLNY';

const MSG = defineMessages({
  claimRewards: {
    id: 'dashboard.TaskClaimReward.claimRewards',
    defaultMessage: 'Claim Rewards',
  },
});

type Props = {
  /*
   * We're not putting a custom defined type on this since it all likeliness it
   * will change
   */
  taskReward: Object,
  taskTitle: string,
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
};

const displayName = 'dashboard.TaskClaimReward';

const TaskClaimReward = ({ openDialog, taskReward, taskTitle }: Props) => (
  <Button
    text={MSG.claimRewards}
    onClick={() =>
      openDialog('TaskClaimRewardDialog', {
        taskReward,
        taskTitle,
        nativeTokenSymbol: MOCK_NATIVE_TOKEN_SYMBOL,
      })
    }
  />
);

TaskClaimReward.displayName = displayName;

export default withDialog()(TaskClaimReward);
