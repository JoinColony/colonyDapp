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
import ClaimProfileDialog from '~users/ClaimProfileDialog';
import ENSNameDialog from '~users/ENSNameDialog';
import { TaskClaimRewardDialog } from '~dashboard/TaskClaimReward';
import UnfinishedProfileDialog from '~users/UnfinishedProfileDialog';
import RecoveryModeDialog from '~admin/RecoveryModeDialog';
import UpgradeContractDialog from '~admin/UpgradeContractDialog';

const dialogComponents: Object = {
  ActivityBarExample,
  ClaimProfileDialog,
  ColonyTokenEditDialog,
  ConfirmDialog,
  ENSNameDialog,
  ManagerRatingDialog,
  RecoveryModeDialog,
  TaskClaimRewardDialog,
  TaskEditDialog,
  TaskInviteDialog,
  TokenMintDialog,
  UnfinishedProfileDialog,
  UpgradeContractDialog,
  UserTokenEditDialog,
  WorkerRatingDialog,
};

export default dialogComponents;
