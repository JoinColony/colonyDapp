/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import { createNetworkTransaction } from '../../core/actionCreators';

import { TOKEN_CREATE_ERROR, TOKEN_CREATE_SUCCESS } from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
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
