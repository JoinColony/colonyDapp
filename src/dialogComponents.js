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
// eslint-disable-next-line max-len
import TaskRequestWorkDialog from '~dashboard/TaskRequestWork/TaskRequestWorkDialog.jsx';
import CreateUsernameDialog from '~users/CreateUsernameDialog';
import { TaskClaimRewardDialog } from '~dashboard/TaskClaimReward';

const dialogComponents: Object = {
  // Hint: Once we have the gas station we just have to add it here
  ActivityBarExample,
  CreateUsernameDialog,
  TokenEditDialog,
  TokenMintDialog,
  TaskRequestWorkDialog,
  ManagerRatingDialog,
  WorkerRatingDialog,
  TaskClaimRewardDialog,
};

export default dialogComponents;
