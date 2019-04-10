/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

export const fetchDomain = (colonyName: ENSName, domainId: number) => ({
  type: ACTIONS.DOMAIN_FETCH,
  meta: {
    keyPath: [colonyName, domainId],
  },
});

export const fetchDomains = (colonyName: ENSName) => ({
  type: ACTIONS.COLONY_DOMAINS_FETCH,
  meta: {
    keyPath: [colonyName],
  },
});
