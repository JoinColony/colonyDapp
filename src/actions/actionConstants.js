// @flow
import { STATE_LOADING, STATE_NOTHING, STATE_READY } from './constants';

type State =
  | typeof STATE_NOTHING
  | typeof STATE_LOADING
  | typeof STATE_READY
  | { my_profile: {} | string };

export type DataReduxStore = {
  state: State,
  data: any, // @TODO
};

export const INITIAL_STATE: DataReduxStore = {
  state: STATE_NOTHING,
  data: {
    colonies: { mycolony: { domains: [] } },
    domains: { mydomain: { tasks: [] } },
    profiles: {},
  },
};

export type Action = { type: string, payload: {} };
