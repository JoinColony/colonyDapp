/* @flow */

import type { DataRecordType } from '../../immutable';
import type { ActionsType, ActionTypeString } from '~redux/types/actions';
import type { ReducerType } from '~redux/types';

import { getActionTypes } from './utils';

const handleFetch = <T: DataRecordType<*>>(state: T) =>
  state.set('isFetching', true);

const handleSuccess = <T: DataRecordType<*>>(state: T) =>
  state.merge({
    error: undefined,
    isFetching: false,
    lastFetchedAt: new Date(),
  });

const handleError = <T: DataRecordType<*>>(state: T, { payload: error }: *) =>
  state.merge({
    isFetching: false,
    error: error.message || error.toString(),
  });

const withDataRecord = <
  T: DataRecordType<*>,
  U: { [actionType: $Keys<ActionsType>]: * },
>(
  actionTypes: ActionTypeString | Set<ActionTypeString>,
) => (wrappedReducer: ReducerType<T, U>) => {
  // Set up fetch/success/error types according to the usual pattern
  const { fetchTypes, successTypes, errorTypes } = getActionTypes(actionTypes);

  // Return a wrapped reducer.
  return (state: *, action: *) => {
    // Pass the state to the wrapped reducer as the first step.
    const nextState = wrappedReducer(state, action);

    // If the action matches a fetch/success/error type, set the next state again.
    const { type } = action;
    if (fetchTypes.has(type)) return handleFetch<T>(nextState);
    if (successTypes.has(type)) return handleSuccess<T>(nextState);
    if (errorTypes.has(type)) return handleError<T>(nextState, action);

    return nextState;
  };
};

export default withDataRecord;
