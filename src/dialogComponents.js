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
import { TokenEditDialog, TokenMintDialog } from '~admin/Tokens';
import TaskEditDialog from '~dashboard/TaskEditDialog';
import ClaimProfileDialog from '~users/ClaimProfileDialog';
import ENSNameDialog from '~users/ENSNameDialog';
import { TaskClaimRewardDialog } from '~dashboard/TaskClaimReward';
import UnfinishedProfileDialog from '~users/UnfinishedProfileDialog';
import RecoveryModeDialog from '~admin/RecoveryModeDialog';
import UpgradeContractDialog from '~admin/UpgradeContractDialog';

const dialogComponents: Object = {
  ActivityBarExample,
  ClaimProfileDialog,
  ConfirmDialog,
  ENSNameDialog,
  TokenEditDialog,
  TokenMintDialog,
  TaskEditDialog,
  ManagerRatingDialog,
  WorkerRatingDialog,
  TaskClaimRewardDialog,
  UnfinishedProfileDialog,
  RecoveryModeDialog,
  UpgradeContractDialog,
};

export default dialogComponents;
