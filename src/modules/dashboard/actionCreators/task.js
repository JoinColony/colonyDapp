/* @flow */

import {
  createTxActionCreator,
  COLONY_CONTEXT,
} from '../../core/actionCreators';

import {
  TASK_FINALIZE_ERROR,
  TASK_FINALIZE_SUCCESS,
  TASK_MANAGER_COMPLETE_ERROR,
  TASK_MANAGER_COMPLETE_SUCCESS,
  TASK_MANAGER_RATE_WORKER_ERROR,
  TASK_MANAGER_RATE_WORKER_SUCCESS,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
  TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
  TASK_SET_DATE_ERROR,
  TASK_SET_DATE_SUCCESS,
  TASK_SET_SKILL_ERROR,
  TASK_SET_SKILL_SUCCESS,
  TASK_WORKER_CLAIM_REWARD_ERROR,
  TASK_WORKER_CLAIM_REWARD_SUCCESS,
  TASK_WORKER_END_ERROR,
  TASK_WORKER_END_SUCCESS,
  TASK_WORKER_RATE_MANAGER_ERROR,
  TASK_WORKER_RATE_MANAGER_SUCCESS,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
  TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
} from '../actionTypes';

import type { TaskId } from '~immutable';

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
    error: TASK_SET_SKILL_ERROR,
    success: TASK_SET_SKILL_SUCCESS,
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
    error: TASK_SET_DATE_ERROR,
    success: TASK_SET_DATE_SUCCESS,
  },
});

/**
 * As worker, submit work and rate before due date.
 */
export const submitTaskDeliverableAndRatingTx = createTxActionCreator<{
  taskId: TaskId,
  deliverableHash: string,
  secret: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'submitTaskDeliverableAndRating',
  lifecycle: {
    error: TASK_WORKER_END_ERROR,
    success: TASK_WORKER_END_SUCCESS,
  },
});

/**
 * As manager, end the task if the due date has elapsed.
 */
export const completeTaskTx = createTxActionCreator<{
  taskId: TaskId,
}>({
  context: COLONY_CONTEXT,
  methodName: 'completeTask',
  lifecycle: {
    error: TASK_MANAGER_COMPLETE_ERROR,
    success: TASK_MANAGER_COMPLETE_SUCCESS,
  },
});

/**
 * As manager, rate the worker.
 */
export const submitWorkerRatingAsManagerTx = createTxActionCreator<{
  taskId: TaskId,
  secret: string,
  role: 'WORKER',
}>({
  context: COLONY_CONTEXT,
  methodName: 'submitTaskWorkRating',
  lifecycle: {
    error: TASK_MANAGER_RATE_WORKER_ERROR,
    success: TASK_MANAGER_RATE_WORKER_SUCCESS,
  },
});

/**
 * As worker, rate the manager.
 */
export const submitManagerRatingAsWorkerTx = createTxActionCreator<{
  taskId: TaskId,
  secret: string,
  role: 'MANAGER',
}>({
  context: COLONY_CONTEXT,
  methodName: 'submitTaskWorkRating',
  lifecycle: {
    error: TASK_WORKER_RATE_MANAGER_ERROR,
    success: TASK_WORKER_RATE_MANAGER_SUCCESS,
  },
});

/**
 * As worker, reveal manager rating.
 */
export const revealTaskRatingAsWorkerTx = createTxActionCreator<{
  taskId: TaskId,
  rating: number,
  salt: number,
  role: 'MANAGER',
}>({
  context: COLONY_CONTEXT,
  methodName: 'revealTaskWorkRating',
  lifecycle: {
    error: TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
    success: TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
  },
});

/**
 * As manager, reveal worker rating.
 */
export const revealTaskRatingAsManagerTx = createTxActionCreator<{
  taskId: TaskId,
  rating: number,
  salt: number,
  role: 'WORKER',
}>({
  context: COLONY_CONTEXT,
  methodName: 'revealTaskWorkRating',
  lifecycle: {
    error: TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
    success: TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
  },
});

/**
 * As the worker, claim payout
 */
export const claimPayoutAsWorkerTx = createTxActionCreator<{
  taskId: TaskId,
  token: string,
  role: 'WORKER',
}>({
  context: COLONY_CONTEXT,
  methodName: 'claimPayout',
  lifecycle: {
    error: TASK_WORKER_CLAIM_REWARD_ERROR,
    success: TASK_WORKER_CLAIM_REWARD_SUCCESS,
  },
});

/**
 * As anyone, finalize task.
 */
export const finalizeTaskTx = createTxActionCreator<{
  taskId: TaskId,
}>({
  context: COLONY_CONTEXT,
  methodName: 'finalizeTask',
  lifecycle: {
    error: TASK_FINALIZE_ERROR,
    success: TASK_FINALIZE_SUCCESS,
  },
});
