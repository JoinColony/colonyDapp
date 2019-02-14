/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

import { COLONY_CONTEXT } from '../../lib/ColonyManager/constants';
import { createTxActionCreator } from './transactions';

export const createDomain = createTxActionCreator<{
  parentDomainId: number,
}>({
  context: COLONY_CONTEXT,
  methodName: 'addDomain',
  lifecycle: {
    created: ACTIONS.DOMAIN_CREATE_TX,
    error: ACTIONS.DOMAIN_CREATE_TX_ERROR,
    success: ACTIONS.DOMAIN_CREATE_TX_SUCCESS,
  },
});

export const fetchDomain = (colonyENSName: ENSName, domainId: number) => ({
  type: ACTIONS.DOMAIN_FETCH,
  meta: {
    keyPath: [colonyENSName, domainId],
  },
});

export const fetchColonyDomains = (colonyENSName: ENSName) => ({
  type: ACTIONS.COLONY_DOMAINS_FETCH,
  meta: {
    keyPath: [colonyENSName],
  },
});
