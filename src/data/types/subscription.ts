import { ContextName } from '~context/index';

export type EventCallback<R> = (event: R) => void;

/*
 * The specification for a data subscription.
 *
 * D: Dependencies the query depend on to be executed. Those will be
 * passed to execute via prepare, which uses the context to set them up.
 *
 * M: Metadata needed to locate the right store, colony contract or dependency
 * in general
 *
 * A: Optional type for the arguments the subscribe function will
 * will be called with.
 *
 * R: Argument for the given event emitter, usually Event type(s).
 */
export type Subscription<D, M, A, R> = {
  context: ContextName[];
  execute: (
    deps: D,
    args: A | undefined,
  ) => Promise<(emitter: EventCallback<R>) => { stop: () => void }[]>;
  name: string;
  prepare: (context: any, metadata: M) => Promise<D>;
};
