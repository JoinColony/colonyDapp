/* @flow */

import type { ContextName } from '~context';
import type { $Pick } from '~types';
import type { EventsType } from './events';

/*
 * The specification for a data query.
 *
 * D: Dependencies the query depend on to be executed. Those will be
 * passed to execute via prepare, which uses the context to set them up.
 *
 * M: Metadata needed to locate the right store, colony contract or dependency
 * in general
 *
 * A: Optional type for the arguments the execute function will
 * will be called with.
 *
 * R: Return type for the execute function.
 */
export type Query<D, M, A, R> = {|
  context: Array<ContextName>,
  prepare: (context: *, metadata: M) => Promise<D>,
  execute: (deps: D, args: A) => Promise<R>,
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
