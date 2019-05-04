/* @flow */

/*
 * @NOTE Dialog components have been extracted into they're own file.
 *
 * This is because this list has a potential of getting very long.
 */

import { ConfirmDialog } from '~core/Dialog';
import ActivityBarExample from '~core/ActivityBar/ActivityBarExample.jsx';
import {
  ManagerRatingDialog,
  WorkerRatingDialog,
} from '~dashboard/TaskRatingDialogs';
import { ColonyTokenEditDialog, TokenMintDialog } from '~admin/Tokens';
import { UserTokenEditDialog } from '~dashboard/Wallet';
import TaskEditDialog from '~dashboard/TaskEditDialog';
import TaskInviteDialog from '~dashboard/Task/TaskInviteDialog.jsx';
import { TaskClaimRewardDialog } from '~dashboard/TaskClaimReward';
import RecoveryModeDialog from '~admin/RecoveryModeDialog';
import UpgradeContractDialog from '~admin/UpgradeContractDialog';

const dialogComponents: Object = {
  ActivityBarExample,
  ColonyTokenEditDialog,
  ConfirmDialog,
  ManagerRatingDialog,
  RecoveryModeDialog,
  TaskClaimRewardDialog,
  TaskEditDialog,
  TaskInviteDialog,
  TokenMintDialog,
  UpgradeContractDialog,
  UserTokenEditDialog,
  WorkerRatingDialog,
};

export default dialogComponents;
