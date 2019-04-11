/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { DomainRecord, DataRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type { AllDomainsMap, DomainRecordType } from '~immutable';
import type { ReducerType } from '~redux';

type DomainActions = {
  COLONY_DOMAINS_FETCH: *,
  COLONY_DOMAINS_FETCH_SUCCESS: *,
  COLONY_DOMAINS_FETCH_ERROR: *,
};

const allDomainsReducer: ReducerType<AllDomainsMap, DomainActions> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [colonyName],
        },
        payload: domains,
      } = action;
      return state.set(
        colonyName,
        DataRecord({
          record: ImmutableSet(domains.map(domain => DomainRecord(domain))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllDomainsMap, ImmutableSet<DomainRecordType>>(
  ACTIONS.COLONY_DOMAINS_FETCH,
  ImmutableMap(),
)(allDomainsReducer);
