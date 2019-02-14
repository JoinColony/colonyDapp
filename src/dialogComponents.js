/* @flow */

/*
 * @NOTE Dialog components have been extracted into they're own file.
 *
 * This is because this list has a potential of getting very long.
 */

import ActivityBarExample from '~components/core/ActivityBar/ActivityBarExample.jsx';
import {
  ManagerRatingDialog,
  WorkerRatingDialog,
} from '~components/TaskRatingDialogs';
import { TokenEditDialog, TokenMintDialog } from '~components/Tokens';
import TaskRequestWorkDialog from '~components/TaskRequestWork/TaskRequestWorkDialog.jsx';
import TaskEditDialog from '~components/TaskEditDialog';
import ClaimProfileDialog from '~components/ClaimProfileDialog';
import ENSNameDialog from '~components/ENSNameDialog';
import { TaskClaimRewardDialog } from '~components/TaskClaimReward';
import UnfinishedProfileDialog from '~components/UnfinishedProfileDialog';
import RecoveryModeDialog from '~components/RecoveryModeDialog';

const dialogComponents: Object = {
  ActivityBarExample,
  ClaimProfileDialog,
  ENSNameDialog,
  TokenEditDialog,
  TokenMintDialog,
  TaskRequestWorkDialog,
  TaskEditDialog,
  ManagerRatingDialog,
  WorkerRatingDialog,
  TaskClaimRewardDialog,
  UnfinishedProfileDialog,
  RecoveryModeDialog,
};

export default dialogComponents;
