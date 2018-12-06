/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import { createColonyTransaction } from '../../core/actionCreators';

import {
  TASK_MANAGER_COMPLETE_ERROR,
  TASK_MANAGER_COMPLETE_SUCCESS,
  TASK_MANAGER_RATE_WORKER_ERROR,
  TASK_MANAGER_RATE_WORKER_SUCCESS,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
  TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
  TASK_WORKER_END_ERROR,
  TASK_WORKER_END_SUCCESS,
  TASK_WORKER_RATE_MANAGER_ERROR,
  TASK_WORKER_RATE_MANAGER_SUCCESS,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
  TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
} from '../actionTypes';

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
