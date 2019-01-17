/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import type { AddressOrENSName } from '~types';

import { createColonyTransaction } from '../../core/actionCreators';

import {
  COLONY_ADMIN_ADD_ERROR,
  COLONY_ADMIN_REMOVE_ERROR,
} from '../actionTypes';

export const addColonyAdminTransaction = (
  identifier: AddressOrENSName,
  params: {
    user: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'setAdminRole',
    identifier,
    lifecycle: {
      error: COLONY_ADMIN_ADD_ERROR,
    },
  });

export const removeColonyAdminTransaction = (
  identifier: AddressOrENSName,
  params: {
    user: string,
  },
  options?: SendOptions,
) =>
  createColonyTransaction({
    params,
    options,
    methodName: 'removeAdminRole',
    identifier,
    lifecycle: {
      error: COLONY_ADMIN_REMOVE_ERROR,
    },
  });
