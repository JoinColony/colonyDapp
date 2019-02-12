/* @flow */

/*
 * Sealed object type that represents an action.
 *
 * T: the action type, e.g. `COLONY_CREATE`
 * P: the action payload, e.g. `{| tokenAddress: string |}`
 * M: any additional `meta` properties, e.g. `keyPath: [*]`
 */
export type ActionType<T, P, M> = {|
  type: T,
  payload: P,
  meta: {|
    id: string,
    ...M,
  |},
|};

export type ErrorActionType<T, M> = ActionType<
  T,
  {| error: typeof Error |},
  {| ...M, error: true |},
>;

export type ActionCreator = <T, P, M>(...args: *) => ActionType<T, P, M>;

export type TakeFilter = (action: ActionType<*, *, *>) => boolean;
