import { ContextName } from '~context/index';
import { AllEvents } from './events';

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
export interface Query<D, M, A, R> {
  context: ContextName[];
  execute: (deps: D, args: A) => Promise<R>;
  name: string;
  prepare: (context: any, metadata: M) => Promise<D>;
}

/*
 * This type, when assigned to a reducer, ensures that the events specified
 * exist in `AllEvents`, and that the event objects are fully typed.
 *
 * T: State for the reducer, e.g. ImmutableMapType<>
 */
export type EventReducer<T> = (currentValue: T, event: AllEvents) => T;
