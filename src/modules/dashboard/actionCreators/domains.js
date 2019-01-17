/* @flow */

import type { ENSName } from '~types';

import {
  createTxActionCreator,
  COLONY_CONTEXT,
} from '../../core/actionCreators';

import {
  DOMAIN_CREATE_TX,
  DOMAIN_CREATE_TX_ERROR,
  DOMAIN_CREATE_TX_SUCCESS,
  DOMAIN_FETCH,
} from '../actionTypes';

export const createDomain = createTxActionCreator<{
  parentSkillId: number,
}>({
  context: COLONY_CONTEXT,
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
