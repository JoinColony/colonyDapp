/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import { createColonyTransaction } from '../../core/actionCreators';

import {
  TASK_SET_SKILL_ERROR,
  TASK_SET_SKILL_SUCCESS,
  TASK_MANAGER_COMPLETE_ERROR,
  TASK_MANAGER_COMPLETE_SUCCESS,
  TASK_MANAGER_RATE_WORKER_ERROR,
  TASK_MANAGER_RATE_WORKER_SUCCESS,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
  TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
  TASK_WORKER_CLAIM_REWARD_ERROR,
  TASK_WORKER_CLAIM_REWARD_SUCCESS,
  TASK_WORKER_END_ERROR,
  TASK_WORKER_END_SUCCESS,
  TASK_WORKER_RATE_MANAGER_ERROR,
  TASK_WORKER_RATE_MANAGER_SUCCESS,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
  TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
  TASK_FINALIZE_ERROR,
  TASK_FINALIZE_SUCCESS,
} from '../actionTypes';

/**
 * As anyone, I want to be able to set a skill
 */
export const taskSetSkill = (
  identifier: string,
  params: {
    taskId: number,
    skillId: number,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'setTaskSkill',
    identifier,
    lifecycle: {
      error: TASK_SET_SKILL_ERROR,
      success: TASK_SET_SKILL_SUCCESS,
    },
  });

/**
 * As worker, submit work and rate before due date.
 */
export const taskWorkerEnd = (
  identifier: string,
  params: {
    taskId: number,
    deliverableHash: string,
    secret: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'submitTaskDeliverableAndRating',
    identifier,
    lifecycle: {
      error: TASK_WORKER_END_ERROR,
      success: TASK_WORKER_END_SUCCESS,
    },
  });

/**
 * As manager, end the task if the due date has elapsed.
 */
export const taskManagerComplete = (
  identifier: string,
  params: {
    taskId: number,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'completeTask',
    identifier,
    lifecycle: {
      error: TASK_MANAGER_COMPLETE_ERROR,
      success: TASK_MANAGER_COMPLETE_SUCCESS,
    },
  });

/**
 * As manager, rate the worker.
 */
export const taskManagerRateWorker = (
  identifier: string,
  params: {
    taskId: number,
    secret: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params: { ...params, role: 'WORKER' },
    options,
    methodName: 'submitTaskWorkRating',
    identifier,
    lifecycle: {
      error: TASK_MANAGER_RATE_WORKER_ERROR,
      success: TASK_MANAGER_RATE_WORKER_SUCCESS,
    },
  });

/**
 * As worker, rate the manager.
 */
export const taskWorkerRateManager = (
  identifier: string,
  params: {
    taskId: number,
    secret: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params: { ...params, role: 'MANAGER' },
    options,
    methodName: 'submitTaskWorkRating',
    identifier,
    lifecycle: {
      error: TASK_WORKER_RATE_MANAGER_ERROR,
      success: TASK_WORKER_RATE_MANAGER_SUCCESS,
    },
  });

/**
 * As worker, reveal manager rating.
 */
export const taskWorkerRevealRating = (
  identifier: string,
  params: {
    taskId: number,
    rating: number,
    salt: number,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params: { ...params, role: 'MANAGER' },
    options,
    methodName: 'revealTaskWorkRating',
    identifier,
    lifecycle: {
      error: TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
      success: TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
    },
  });

/**
 * As manager, reveal worker rating.
 */
export const taskManagerRevealRating = (
  identifier: string,
  params: {
    taskId: number,
    rating: number,
    salt: number,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params: { ...params, role: 'WORKER' },
    options,
    methodName: 'revealTaskWorkRating',
    identifier,
    lifecycle: {
      error: TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
      success: TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
    },
  });

export const taskWorkerClaimReward = (
  identifier: string,
  params: {
    taskId: number,
    token: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params: { ...params, role: 'WORKER' },
    options,
    methodName: 'claimPayout',
    identifier,
    lifecycle: {
      error: TASK_WORKER_CLAIM_REWARD_ERROR,
      success: TASK_WORKER_CLAIM_REWARD_SUCCESS,
    },
  });

/**
 * As anyone, finalize task.
 */
export const taskFinalize = (
  identifier: string,
  params: {
    taskId: number,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params: { ...params },
    options,
    methodName: 'finalizeTask',
    identifier,
    lifecycle: {
      error: TASK_FINALIZE_ERROR,
      success: TASK_FINALIZE_SUCCESS,
    },
  });
