/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  COLONY_DOMAINS_FETCH_SUCCESS,
  DOMAIN_FETCH,
  DOMAIN_FETCH_SUCCESS,
  DOMAIN_CREATE_SUCCESS,
} from '../actionTypes';

import { Domain, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { UniqueActionWithKeyPath } from '~types';
import type { AllDomainsMap, DomainRecord } from '~immutable';

const allDomainsReducer = (
  state: AllDomainsMap = ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case COLONY_DOMAINS_FETCH_SUCCESS: {
      const {
        keyPath,
        props: { domains },
      } = action.payload;
      let newState = state;
      domains.forEach(({ _id, ...domain }) => {
        const id = parseInt(_id, 10);
        newState = newState.setIn(
          [...keyPath, id],
          Data({ record: Domain({ id, ...domain }) }),
        );
      });
      return newState;
    }
    case DOMAIN_CREATE_SUCCESS: {
      const {
        keyPath: [ensName, domainId],
        props,
      } = action.payload;
      return state
        ? state.setIn(
            [ensName, domainId],
            Data({ record: Domain({ ...props }) }),
          )
        : state;
    }
    case DOMAIN_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName, domainId],
          keyPath,
        },
        payload,
      } = action;
      const data = Data<DomainRecord>({
        record: Domain({ id: domainId, ...payload }),
      });

      return state.get(ensName)
        ? state.mergeDeepIn(keyPath, data)
        : state.setIn(ensName, ImmutableMap([[domainId, data]]));
    }
    default:
      return state;
  }
};

export default withDataReducer<AllDomainsMap, DomainRecord>(
  DOMAIN_FETCH,
  ImmutableMap(),
)(allDomainsReducer);
