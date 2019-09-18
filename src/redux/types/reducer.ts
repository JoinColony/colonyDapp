import { AllActions } from './actions';

/*
 * This type, when assigned to a reducer, ensures that the actions specified
 * exist in `AllActions`, and that the action objects are fully typed.
 *
 * T: State for the reducer, e.g. ImmutableMap<>
 */
export type ReducerType<T> = (state: T, action: AllActions) => T;
