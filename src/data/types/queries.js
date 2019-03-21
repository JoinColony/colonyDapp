/* @flow */

import type { $Pick } from '~types';
import type { EventsType } from './events';

/*
 * The specification for a data query.
 *
 * C: Optional object type indicating the context the query will
 * be executed with.
 *
 * A: Optional type for the arguments the execute function will
 * will be called with.
 *
 * R: Return type for the execute function.
 */
export type Query<C: ?Object, A, R> = C => {|
  execute: (args: A) => Promise<R>,
|};

/*
 * This type, when assigned to a reducer, ensures that the actions specified
 * exist in `ActionsType`, and that the action objects are fully typed.
 *
 * T: State for the reducer, e.g. ImmutableMapType<>
 *
 * U: Object of action types with passthrough values, e.g.
 * ReducerType<State, {| COLONY_CREATE: *, COLONY_CREATE_ERROR: * |}>
 */
export type EventReducer<T, U: { [eventType: $Keys<EventsType>]: * }> = (
  currentValue: T,
  action: $Values<$Pick<EventsType, U>>,
) => T;
