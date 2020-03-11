import { ROLES } from '~constants';
import { AnyTask, FullColonyFragment, OneSuggestion } from '~data/index';
import { TaskUserType } from '~immutable/index';
import { Address } from '~types/index';
import { hasRoot, canAdminister, canFund } from '../users/checks';

/*
 * Colony
 */
export const canBeUpgraded = (
  colony: FullColonyFragment | undefined,
  networkVersion: number | null,
) =>
  colony && colony.version && networkVersion && networkVersion > colony.version;

/*
 * Tasks
 */

/**
 * @todo Wire task payouts.
 */
export const didClaimPayout = (
  taskUser: TaskUserType | undefined,
  userAddress: Address,
) => taskUser && taskUser.didClaimPayout && taskUser.address === userAddress;

// @todo reimplement isManager
export const isManager = (task: AnyTask, managerAddress?: string) =>
  task && !!managerAddress && false;

export const isWorker = (
  { assignedWorkerAddress }: AnyTask,
  userAddress: Address,
) => assignedWorkerAddress && assignedWorkerAddress === userAddress;

export const isCreator = ({ creatorAddress }: AnyTask, userAddress: Address) =>
  creatorAddress && creatorAddress === userAddress;

export const isPayoutsSet = ({ payouts }: AnyTask) =>
  !!payouts && payouts.length > 0;

export const isFinalized = ({ finalizedAt }: AnyTask) => !!finalizedAt;

export const isCancelled = ({ cancelledAt }: AnyTask) => !!cancelledAt;

// @todo reimplement isRating
export const isRating = (task: AnyTask) => task && false;

export const isActive = ({ cancelledAt, finalizedAt }: AnyTask) =>
  !cancelledAt && !finalizedAt;

// @todo reimplement isReveal
export const isReveal = (task: AnyTask) => task && false;

export const didDueDateElapse = ({ dueDate }: AnyTask) =>
  !!(dueDate && new Date(dueDate) < new Date());

export const isWorkerSet = ({ assignedWorkerAddress }: AnyTask) =>
  !!assignedWorkerAddress;

export const canEditTask = (task: AnyTask, roles: ROLES[]) =>
  !isFinalized(task) && !isCancelled(task) && canAdminister(roles);

export const isDomainSet = ({ ethDomainId }: AnyTask) => !!ethDomainId;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isSkillSet = ({ ethSkillId }: AnyTask) => !!ethSkillId;

/**
 * @todo Fix task rating checks logic.
 * @body Fix this logic in #169
 */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const workerCanRateManager = (task: AnyTask, userAddress: Address) =>
  false;

export const workerCanEndTask = (task: AnyTask, userAddress: Address) =>
  isWorker(task, userAddress) && !(isRating(task) || didDueDateElapse(task));

export const workerCanRevealManagerRating = (
  task: AnyTask,
  userAddress: Address,
) => !!(isWorker(task, userAddress) && isReveal(task));

export const managerCanRateWorker = (task: AnyTask, userAddress: Address) =>
  !!(isManager(task, userAddress) && isRating(task));

export const managerCanEndTask = (task: AnyTask, userAddress: Address) =>
  !isRating(task) && isManager(task, userAddress) && didDueDateElapse(task);

export const managerCanRevealWorkerRating = (
  task: AnyTask,
  userAddress: Address,
) => isManager(task, userAddress) && isReveal(task);

export const canCancelTask = (task: AnyTask, roles: ROLES[]) =>
  isActive(task) && canAdminister(roles);

export const hasRequestedToWork = (
  { workRequestAddresses = [] }: AnyTask,
  userAddress: Address,
) =>
  workRequestAddresses.find(
    workRequestAddress => workRequestAddress === userAddress,
  );

export const canRequestToWork = (task: AnyTask, userAddress: Address) =>
  !(
    isWorkerSet(task) ||
    isCreator(task, userAddress) ||
    hasRequestedToWork(task, userAddress)
  ) && isActive(task);

export const canFinalizeTask = (task: AnyTask, roles: ROLES[]) =>
  task &&
  isActive(task) &&
  isWorkerSet(task) &&
  isDomainSet(task) &&
  isPayoutsSet(task) &&
  canAdminister(roles) &&
  canFund(roles);

export const canRecoverColony = hasRoot;

/*
 * Suggestions
 */

export const hasUpvotedSuggestion = (
  upvotes: OneSuggestion['upvotes'],
  userAddress: Address,
) => upvotes.includes(userAddress);
