/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { DataRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type { AllAdminsMap } from '~immutable';
import type { ReducerType } from '~redux';

type AdminActions = {
  COLONY_ADMINS_FETCH: *,
  COLONY_ADMINS_FETCH_SUCCESS: *,
  COLONY_ADMINS_FETCH_ERROR: *,
};

const allDomainsReducer: ReducerType<AllAdminsMap, AdminActions> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.COLONY_ADMINS_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName],
        },
        payload: admins,
      } = action;
      return state.set(
        ensName,
        DataRecord({
          record: ImmutableSet(admins),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllAdminsMap, ImmutableSet<string>>(
  ACTIONS.COLONY_DOMAINS_FETCH,
  ImmutableMap(),
)(allDomainsReducer);
