/* @flow */

/*
 * @NOTE Dialog components have been extracted into they're own file.
 *
 * This is because this list has a potential of getting very long.
 */

import ActivityBarExample from '~core/ActivityBar/ActivityBarExample.jsx';
import {
  ManagerRatingDialog,
  WorkerRatingDialog,
} from '~dashboard/TaskRatingDialogs';
import { TokenEditDialog, TokenMintDialog } from '~admin/Tokens';
import TaskRequestWorkDialog from '~dashboard/TaskRequestWork/TaskRequestWorkDialog.jsx';
import TaskEditDialog from '~dashboard/TaskEditDialog';
import TaskInviteDialog from '~dashboard/Task/TaskInviteDialog.jsx';
import ClaimProfileDialog from '~users/ClaimProfileDialog';
import ENSNameDialog from '~users/ENSNameDialog';
import { TaskClaimRewardDialog } from '~dashboard/TaskClaimReward';
import UnfinishedProfileDialog from '~users/UnfinishedProfileDialog';
import RecoveryModeDialog from '~admin/RecoveryModeDialog';

const dialogComponents: Object = {
  ActivityBarExample,
  ClaimProfileDialog,
  ENSNameDialog,
  TokenEditDialog,
  TokenMintDialog,
  TaskRequestWorkDialog,
  TaskEditDialog,
  TaskInviteDialog,
  ManagerRatingDialog,
  WorkerRatingDialog,
  TaskClaimRewardDialog,
  UnfinishedProfileDialog,
  RecoveryModeDialog,
};

export default dialogComponents;
