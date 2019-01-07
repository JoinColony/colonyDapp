/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  DOMAIN_FETCH,
  DOMAIN_FETCH_SUCCESS,
  DOMAIN_CREATE_SUCCESS,
} from '../actionTypes';

import { Domain, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { Action, ENSName } from '~types';

import type { AllDomainsState, DomainsMap } from '../types';

const allDomainsReducer = (
  state: AllDomainsState = new ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case DOMAIN_CREATE_SUCCESS:
    case DOMAIN_FETCH_SUCCESS: {
      const {
        keyPath: [ensName, domainId],
        keyPath,
        props,
      } = action.payload;
      const data = Data({ record: Domain({ domainId, ...props }) });

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
