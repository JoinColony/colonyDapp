/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { DomainRecord, DataRecord } from '~immutable';
import { withDataReducer } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type { AllDomainsMap, DomainRecordType } from '~immutable';
import type { ReducerType } from '~redux';

const allDomainsReducer: ReducerType<
  AllDomainsMap,
  {|
    COLONY_DOMAINS_FETCH_SUCCESS: *,
    DOMAIN_CREATE_SUCCESS: *,
    DOMAIN_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName],
        },
        payload: domains,
      } = action;
      return state.withMutations(mutable => {
        domains.forEach(({ _id, ...domain }) => {
          const id = parseInt(_id, 10);
          mutable.mergeIn(
            [ensName, id],
            DataRecord<DomainRecordType>({
              record: DomainRecord({ id, ...domain }),
            }),
          );
        });
        return mutable;
      });
    }
    case ACTIONS.DOMAIN_CREATE_SUCCESS:
    case ACTIONS.DOMAIN_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName],
          keyPath,
        },
        payload,
      } = action;
      const data = DataRecord<DomainRecordType>({
        record: DomainRecord(payload),
      });
      return state.has(ensName)
        ? state.mergeDeepIn(keyPath, data)
        : // $FlowFixMe some bullshit
          state.set(ensName, ImmutableMap({ [ensName]: data }));
    }
    default:
      return state;
  }
};

export default withDataReducer<AllDomainsMap, DomainRecordType>(
  ACTIONS.DOMAIN_FETCH,
  ImmutableMap(),
)(allDomainsReducer);
