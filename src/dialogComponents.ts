/*
 * Dialog components have been extracted into their own file;
 * this is because this list has the potential of getting very long.
 */

import { ConfirmDialog, DialogComponent } from '~core/Dialog';
import ActivityBarExample from '~core/ActivityBar/ActivityBarExample';
import {
  ManagerRatingDialog,
  WorkerRatingDialog,
} from '~dashboard/TaskRatingDialogs';
import { ColonyTokenEditDialog, TokenMintDialog } from '~admin/Tokens';
import { UserTokenEditDialog } from '~dashboard/Wallet';
import TaskEditDialog from '~dashboard/TaskEditDialog';
import TaskInviteDialog from '~dashboard/Task/TaskInviteDialog';
import { TaskClaimRewardDialog } from '~dashboard/TaskClaimReward';
import DomainEditDialog from '~admin/DomainEditDialog';
import RecoveryModeDialog from '~admin/RecoveryModeDialog';
import UnlockTokenDialog from '~admin/Profile/UnlockTokenDialog';
import UpgradeContractDialog from '~admin/UpgradeContractDialog';

const dialogComponents: { [k: string]: DialogComponent } = {
  ActivityBarExample,
  ColonyTokenEditDialog,
  ConfirmDialog,
  DomainEditDialog,
  ManagerRatingDialog,
  RecoveryModeDialog,
  TaskClaimRewardDialog,
  TaskEditDialog,
  TaskInviteDialog,
  TokenMintDialog,
  UnlockTokenDialog,
  UpgradeContractDialog,
  UserTokenEditDialog,
  WorkerRatingDialog,
};

export default dialogComponents;
