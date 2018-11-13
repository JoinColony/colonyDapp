/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { DialogType } from '~core/Dialog';
import type { Props as WrapperProps } from './TaskClaimReward';

import Button from '~core/Button';

const MSG = defineMessages({
  claimRewards: {
    id: 'dashboard.TaskClaimReward.claimRewards',
    defaultMessage: 'Claim Rewards',
  },
});

export type Props = WrapperProps & {
  /*
   * We're not putting a custom defined type on this since it all likeliness it
   * will change
   */
  sortedPayouts: Array<Object>,
  nativeTokenPayout: Object | void,
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
};

const displayName = 'dashboard.TaskClaimReward';

const TaskClaimReward = ({
  openDialog,
  taskReward,
  taskTitle,
  sortedPayouts,
  nativeTokenPayout,
}: Props) => (
  <Button
    text={MSG.claimRewards}
    onClick={() =>
      openDialog('TaskClaimRewardDialog', {
        taskReward,
        taskTitle,
        sortedPayouts,
        nativeTokenPayout,
      })
    }
  />
);

TaskClaimReward.displayName = displayName;

export default TaskClaimReward;
