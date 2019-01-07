/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import type { AddressOrENSName, ENSName } from '~types';

import { createColonyTransaction } from '../../core/actionCreators';

import {
  DOMAIN_CREATE_ERROR,
  DOMAIN_CREATE_SUCCESS,
  DOMAIN_FETCH,
} from '../actionTypes';

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

export const fetchDomain = (colonyENSName: ENSName, domainId: number) => ({
  type: DOMAIN_FETCH,
  payload: {
    keyPath: [colonyENSName, domainId],
  },
});
