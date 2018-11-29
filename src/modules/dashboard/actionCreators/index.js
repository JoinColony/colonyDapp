/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import {
  createNetworkTransaction,
  createColonyTransaction,
} from '../../core/actionCreators';

import {
  COLONY_CREATE_ERROR,
  COLONY_CREATE_SUCCESS,
  COLONY_CREATE_LABEL_ERROR,
  COLONY_CREATE_LABEL_SUCCESS,
  TOKEN_CREATE_ERROR,
  TOKEN_CREATE_SUCCESS,
  TASK_WORKER_END_ERROR,
  TASK_WORKER_END_SUCCESS,
  TASK_MANAGER_COMPLETE_ERROR,
  TASK_MANAGER_COMPLETE_SUCCESS,
  TASK_MANAGER_RATE_ERROR,
  TASK_MANAGER_RATE_SUCCESS,
} from '../actionTypes';

export const createColony = (
  params: { tokenAddress: string },
  options?: SendOptions,
) =>
  createNetworkTransaction({
    params,
    options,
    methodName: 'createColony',
    lifecycle: {
      error: COLONY_CREATE_ERROR,
      success: COLONY_CREATE_SUCCESS,
    },
  });

export const createToken = (
  params: { name: string, symbol: string },
  options?: SendOptions,
) =>
  createNetworkTransaction({
    params,
    options,
    methodName: 'createToken',
    lifecycle: {
      error: TOKEN_CREATE_ERROR,
      success: TOKEN_CREATE_SUCCESS,
    },
  });

export const createColonyLabel = (
  params: {
    colonyName: string,
    orbitDBPath: string,
  },
  options?: SendOptions,
) =>
  createNetworkTransaction({
    params,
    options,
    methodName: 'registerColonyLabel',
    lifecycle: {
      error: COLONY_CREATE_LABEL_ERROR,
      success: COLONY_CREATE_LABEL_SUCCESS,
    },
  });

/**
 * As worker, submit work and rate before due date.
 */
export const taskWorkerEnd = (
  identifier: string,
  params: {
    taskId: string,
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
    taskId: string,
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
export const taskManagerRate = (
  identifier: string,
  params: {
    taskId: string,
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
      error: TASK_MANAGER_RATE_ERROR,
      success: TASK_MANAGER_RATE_SUCCESS,
    },
  });
