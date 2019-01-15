/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
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
    case DOMAIN_CREATE_SUCCESS: {
      const {
        keyPath: [ensName, domainId],
        props: { domainId: id, domainName: name },
      } = action.payload;
      return state
        ? state.setIn(
            [ensName, domainId],
            Data({ record: Domain({ id, name }) }),
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
        record: Domain({ domainId, ...payload }),
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
