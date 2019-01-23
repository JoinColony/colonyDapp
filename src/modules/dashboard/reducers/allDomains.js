/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  DOMAIN_FETCH,
  DOMAIN_FETCH_SUCCESS,
  DOMAIN_CREATE_SUCCESS,
} from '../actionTypes';

import { Domain, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { UniqueActionWithKeyPath, ENSName } from '~types';

import type { AllDomainsState, DomainsMap } from '../types';

const allDomainsReducer = (
  state: AllDomainsState = new ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case DOMAIN_CREATE_SUCCESS:
    case DOMAIN_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName, domainId],
          keyPath,
        },
        payload,
      } = action;
      const data = Data({ record: Domain({ domainId, ...payload }) });

      return state.get(ensName)
        ? state.mergeDeepIn(keyPath, data)
        : state.set(ensName, ImmutableMap([[domainId, data]]));
    }
    default:
      return state;
  }
};

export default withDataReducer<ENSName, DomainsMap>(DOMAIN_FETCH)(
  allDomainsReducer,
);
