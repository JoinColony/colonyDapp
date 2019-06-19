/* @flow */

import type { BehaviorSubject } from 'rxjs';

import type { ContextName } from '~context';
import type { $Pick } from '~types';
import type { EventsType, Event } from './events';

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
  context: ContextName[],
  execute: (deps: D, args: A) => Promise<R>,
  name: string,
  prepare: (context: *, metadata: M) => Promise<D>,
|};

// 'XQ3Ks' will eventually deprecate Query
export type XtremeQuery3000<D, M, A, R> = {|
  context: ContextName[],
  executeAsync: (deps: D, args: A) => Promise<Event<*>[]>,
  executeObservable: (deps: D, args: A) => BehaviorSubject<Event<*>[]>,
  name: string,
  prepare: (context: *, metadata: M, args: A) => Promise<D>,
  reducer: (result: R, event: Event<*>) => R,
  seed: any,
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
