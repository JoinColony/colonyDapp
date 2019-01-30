/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  COLONY_DOMAINS_FETCH_SUCCESS,
  DOMAIN_FETCH,
  DOMAIN_FETCH_SUCCESS,
  DOMAIN_CREATE_SUCCESS,
} from '../actionTypes';

import { DomainRecord, DataRecord } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { UniqueActionWithKeyPath } from '~types';
import type { AllDomainsMap, DomainRecordType } from '~immutable';

const allDomainsReducer = (
  state: AllDomainsMap = ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case COLONY_DOMAINS_FETCH_SUCCESS: {
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
    case DOMAIN_CREATE_SUCCESS:
    case DOMAIN_FETCH_SUCCESS: {
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
        : state.set(ensName, ImmutableMap([[ensName, data]]));
    }
    default:
      return state;
  }
};

export default withDataReducer<AllDomainsMap, DomainRecordType>(
  DOMAIN_FETCH,
  ImmutableMap(),
)(allDomainsReducer);
