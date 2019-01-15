/* @flow */

import type { ENSName } from '~types';

import {
  createTxActionCreator,
  COLONY_CONTEXT,
} from '../../core/actionCreators';

import {
  COLONY_DOMAINS_FETCH,
  DOMAIN_CREATE_TX,
  DOMAIN_CREATE_TX_ERROR,
  DOMAIN_CREATE_TX_SUCCESS,
  DOMAIN_FETCH,
} from '../actionTypes';

export const createDomain = createTxActionCreator<{
  parentDomainId: number,
}>({
  context: COLONY_CONTEXT,
  methodName: 'addDomain',
  lifecycle: {
    created: DOMAIN_CREATE_TX,
    error: DOMAIN_CREATE_TX_ERROR,
    success: DOMAIN_CREATE_TX_SUCCESS,
  },
});

export const fetchDomain = (colonyENSName: ENSName, domainId: number) => ({
  type: DOMAIN_FETCH,
  meta: {
    keyPath: [colonyENSName, domainId],
  },
});

export const fetchColonyDomains = (colonyENSName: ENSName) => ({
  type: COLONY_DOMAINS_FETCH,
  payload: {
    colonyENSName,
  },
});
