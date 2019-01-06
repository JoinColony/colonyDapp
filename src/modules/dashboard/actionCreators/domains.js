/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import type { AddressOrENSName } from '~types';

import { createColonyTransaction } from '../../core/actionCreators';

import { DOMAIN_CREATE_ERROR, DOMAIN_CREATE_SUCCESS } from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const createDomain = (
  identifier: AddressOrENSName,
  params: { parentDomainId: number },
  options?: SendOptions,
) =>
  createColonyTransaction({
    identifier,
    params,
    options,
    methodName: 'addDomain',
    lifecycle: {
      error: DOMAIN_CREATE_ERROR,
      eventDataReceived: DOMAIN_CREATE_SUCCESS,
    },
  });
