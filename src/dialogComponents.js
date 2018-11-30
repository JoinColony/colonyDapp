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
import TaskEditDialog from '~dashboard/Task/TaskEditDialog.jsx';
import CreateUsernameDialog from '~users/CreateUsernameDialog';
import { TaskClaimRewardDialog } from '~dashboard/TaskClaimReward';
import UnfinishedProfileDialog from '~users/UnfinishedProfileDialog';

const dialogComponents: Object = {
  // Hint: Once we have the gas station we just have to add it here
  ActivityBarExample,
  CreateUsernameDialog,
  TokenEditDialog,
  TokenMintDialog,
  TaskRequestWorkDialog,
  TaskEditDialog,
  ManagerRatingDialog,
  WorkerRatingDialog,
  TaskClaimRewardDialog,
  UnfinishedProfileDialog,
};

export default dialogComponents;
