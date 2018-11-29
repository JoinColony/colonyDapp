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
  TASK_SUBMIT_WORK_ERROR,
  TASK_SUBMIT_WORK_SUCCESS,
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

export const taskSubmitWork = (
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
      error: TASK_SUBMIT_WORK_ERROR,
      success: TASK_SUBMIT_WORK_SUCCESS,
    },
  });
