/* @flow */

import type { Address } from '~types';
import type { DomainId } from '~immutable';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const fetchDomain = (
  colonyAddress: Address,
  domainId: DomainId,
): Action<typeof ACTIONS.DOMAIN_FETCH> => ({
  type: ACTIONS.DOMAIN_FETCH,
  payload: { colonyAddress, domainId },
  meta: {
    keyPath: [colonyAddress, domainId],
  },
});

export const fetchDomains = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_DOMAINS_FETCH> => ({
  type: ACTIONS.COLONY_DOMAINS_FETCH,
  payload: { colonyAddress },
  meta: {
    keyPath: [colonyAddress],
  },
});
