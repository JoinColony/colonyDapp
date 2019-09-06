import { FetchableDataRecord } from '../../immutable';
import { AllActions, ActionTypeString } from '~redux/types/actions';
import { ReducerType } from '~redux/types';

import { getActionTypes } from './utils';

const handleFetch = <T extends FetchableDataRecord<any>>(state: T) =>
  state.set('isFetching', true);

const handleSuccess = <T extends FetchableDataRecord<any>>(state: T) =>
  state.merge({
    error: undefined,
    isFetching: false,
    lastFetchedAt: new Date(),
  });

const handleError = <T extends FetchableDataRecord<any>>(
  state: T,
  { payload: error }: any,
) =>
  state.merge({
    isFetching: false,
    error: error.message || error.toString(),
  });

const withFetchableData = <T extends FetchableDataRecord<any>>(
  actionTypes: ActionTypeString | Set<ActionTypeString>,
) => (wrappedReducer: ReducerType<T>) => {
  // Set up fetch/success/error types according to the usual pattern
  const { fetchTypes, successTypes, errorTypes } = getActionTypes(actionTypes);

  // Return a wrapped reducer.
  return (state: any, action: AllActions) => {
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

export default withFetchableData;
