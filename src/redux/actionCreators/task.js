/* @flow */

import { ACTIONS } from '~redux';

import { COLONY_CONTEXT } from '../../lib/ColonyManager/constants';
import { createTxActionCreator } from './transactions';

import type { TaskId } from '~immutable';

export const taskCreateBatch = createTxActionCreator({
  context: COLONY_CONTEXT,
  methodName: 'createTask',
});

export const taskMoveFundsBatch = createTxActionCreator({
  context: COLONY_CONTEXT,
  methodName: 'moveFundsBetweenPots',
});

export const taskSetWorkerPayoutBatch = createTxActionCreator({
  context: COLONY_CONTEXT,
  methodName: 'setTaskWorkerPayout',
  // We just need the signature of the manager in this case
  multisig: true,
});

export const taskSetWorkerRoleBatch = createTxActionCreator({
  context: COLONY_CONTEXT,
  methodName: 'setTaskWorkerRole',
  multisig: true,
});

/**
 * As worker or manager, I want to be able to set a skill
 */
export const setTaskSkillTx = createTxActionCreator<{
  taskId: TaskId,
  skillId: number,
}>({
  context: COLONY_CONTEXT,
  methodName: 'setTaskSkill',
  lifecycle: {
    error: ACTIONS.TASK_SET_SKILL_ERROR,
    success: ACTIONS.TASK_SET_SKILL_SUCCESS,
  },
});

/**
 * As worker or manager, I want to be able to set a date
 */
export const setTaskDueDateTx = createTxActionCreator<{
  taskId: TaskId,
  dueDate: Date,
}>({
  context: COLONY_CONTEXT,
  methodName: 'setTaskDueDate',
  lifecycle: {
    error: ACTIONS.TASK_SET_DATE_ERROR,
    success: ACTIONS.TASK_SET_DATE_SUCCESS,
  },
});

/**
 * As worker, submit work (`completeTask` group)
 */
// TODO: Add lifecycle methods if applicable
export const submitTaskDeliverableTx = createTxActionCreator<{
  taskId: TaskId,
  deliverableHash: string,
}>({
  context: COLONY_CONTEXT,
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 0,
  },
  methodName: 'submitTaskDeliverable',
});

/**
 * As worker, submit work and rate before due date (`completeTask` group)
 * Alternative to submitTaskDeliverable
 */
export const submitTaskDeliverableAndRatingTx = createTxActionCreator<{
  taskId: TaskId,
  deliverableHash: string,
  secret: string,
}>({
  context: COLONY_CONTEXT,
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 0,
  },
  methodName: 'submitTaskDeliverableAndRating',
  lifecycle: {
    error: ACTIONS.TASK_WORKER_END_ERROR,
    success: ACTIONS.TASK_WORKER_END_SUCCESS,
  },
});

/**
 * As manager, end the task if the due date has elapsed (`completeTask` group)
 */
export const completeTaskTx = createTxActionCreator<{
  taskId: TaskId,
}>({
  context: COLONY_CONTEXT,
  methodName: 'completeTask',
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 1,
  },
  lifecycle: {
    error: ACTIONS.TASK_MANAGER_COMPLETE_ERROR,
    success: ACTIONS.TASK_MANAGER_COMPLETE_SUCCESS,
  },
});

/**
 * As manager, rate the worker (`completeTask` group)
 */
export const submitWorkerRatingAsManagerTx = createTxActionCreator<{
  taskId: TaskId,
  secret: string,
  role: 'WORKER',
}>({
  context: COLONY_CONTEXT,
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 2,
  },
  methodName: 'submitTaskWorkRating',
  lifecycle: {
    error: ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR,
    success: ACTIONS.TASK_MANAGER_RATE_WORKER_SUCCESS,
  },
});

/**
 * As worker, rate the manager (`completeTask` group)
 */
export const submitManagerRatingAsWorkerTx = createTxActionCreator<{
  taskId: TaskId,
  secret: string,
  role: 'MANAGER',
}>({
  context: COLONY_CONTEXT,
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 2,
  },
  methodName: 'submitTaskWorkRating',
  lifecycle: {
    error: ACTIONS.TASK_WORKER_RATE_MANAGER_ERROR,
    success: ACTIONS.TASK_WORKER_RATE_MANAGER_SUCCESS,
  },
});

/**
 * As worker, reveal manager rating (`completeTask` group)
 */
export const revealTaskRatingAsWorkerTx = createTxActionCreator<{
  taskId: TaskId,
  rating: number,
  salt: number,
  role: 'MANAGER',
}>({
  context: COLONY_CONTEXT,
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 3,
  },
  methodName: 'revealTaskWorkRating',
  lifecycle: {
    error: ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
    success: ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
  },
});

/**
 * As manager, reveal worker rating (`completeTask` group)
 */
export const revealTaskRatingAsManagerTx = createTxActionCreator<{
  taskId: TaskId,
  rating: number,
  salt: number,
  role: 'WORKER',
}>({
  context: COLONY_CONTEXT,
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 3,
  },
  methodName: 'revealTaskWorkRating',
  lifecycle: {
    error: ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
    success: ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
  },
});

/**
 * As anyone, finalize task (`completeTask` group)
 */
export const finalizeTaskTx = createTxActionCreator<{
  taskId: TaskId,
}>({
  context: COLONY_CONTEXT,
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 4,
  },
  methodName: 'finalizeTask',
  lifecycle: {
    error: ACTIONS.TASK_FINALIZE_ERROR,
    success: ACTIONS.TASK_FINALIZE_SUCCESS,
  },
});

/**
 * As the worker, claim payout (`completeTask` group)
 */
export const claimPayoutAsWorkerTx = createTxActionCreator<{
  taskId: TaskId,
  token: string,
  role: 'WORKER',
}>({
  context: COLONY_CONTEXT,
  group: {
    key: 'completeTask',
    id: ['identifier', 'params.taskId'],
    index: 5,
  },
  methodName: 'claimPayout',
  lifecycle: {
    error: ACTIONS.TASK_WORKER_CLAIM_REWARD_ERROR,
    success: ACTIONS.TASK_WORKER_CLAIM_REWARD_SUCCESS,
  },
});
