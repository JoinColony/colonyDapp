/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

export const fetchDomain = (colonyENSName: ENSName, domainId: number) => ({
  type: ACTIONS.DOMAIN_FETCH,
  meta: {
    keyPath: [colonyENSName, domainId],
  },
});

export const fetchDomains = (colonyENSName: ENSName) => ({
  type: ACTIONS.COLONY_DOMAINS_FETCH,
  meta: {
    keyPath: [colonyENSName],
  },
});
