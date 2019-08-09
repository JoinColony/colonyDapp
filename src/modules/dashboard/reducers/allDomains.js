/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { DomainRecord, DataRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type { AllDomainsMap, DomainRecordType } from '~immutable';
import type { ReducerType } from '~redux';

type DomainActions = {
  DOMAIN_CREATE_SUCCESS: *,
  COLONY_DOMAINS_FETCH: *,
  COLONY_DOMAINS_FETCH_SUCCESS: *,
  COLONY_DOMAINS_FETCH_ERROR: *,
};

const allDomainsReducer: ReducerType<AllDomainsMap, DomainActions> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.DOMAIN_CREATE_SUCCESS: {
      const { colonyAddress, domain } = action.payload;
      const path = [colonyAddress, 'record'];
      return state.getIn(path)
        ? state.updateIn(
            path,
            domains => domains && domains.add(DomainRecord(domain)),
          )
        : state.set(
            colonyAddress,
            DataRecord({
              record: ImmutableSet.of(DomainRecord(domain)),
            }),
          );
    }
    case ACTIONS.DOMAIN_EDIT_SUCCESS: {
      const { colonyAddress, domainName, domainId } = action.payload;
      const path = [colonyAddress, 'record'];
      return state.updateIn(path, domains => {
        const domainFound = domains.find(
          existingDomain => existingDomain.id === domainId,
        );

        domainFound.set('name', domainName);
        return domains;
      });
    }
    case ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS: {
      const {
        meta: { key },
        payload: { domains },
      } = action;
      return state.set(
        key,
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
