/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import type { AddressOrENSName, ENSName } from '~types';

import { createColonyTransaction } from '../../core/actionCreators';

import {
  DOMAIN_CREATE_TX,
  DOMAIN_CREATE_TX_ERROR,
  DOMAIN_CREATE_TX_SUCCESS,
  DOMAIN_FETCH,
} from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const createDomain = (
  identifier: AddressOrENSName,
  params: { parentSkillId: number },
  options?: SendOptions,
) =>
  createColonyTransaction({
    identifier,
    params,
    options,
    methodName: 'addDomain',
    lifecycle: {
      created: DOMAIN_CREATE_TX,
      error: DOMAIN_CREATE_TX_ERROR,
      eventDataReceived: DOMAIN_CREATE_TX_SUCCESS,
    },
  });

export const fetchDomain = (colonyENSName: ENSName, domainId: number) => ({
  type: DOMAIN_FETCH,
  payload: {
    keyPath: [colonyENSName, domainId],
  },
});
