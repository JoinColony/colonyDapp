export const SET_DATA_STATE = 'SET_DATA_STATE';
export const SET_COLONY_CONTENT = 'SET_COLONY_CONTENT';
export const SET_DOMAIN_CONTENT = 'SET_DOMAIN_CONTENT';
export const SET_PROFILE_STATE = 'SET_PROFILE_STATE';
export const SET_PROFILE_CONTENT = 'SET_PROFILE_CONTENT';
export const SET_TASK_CONTENT = 'SET_TASK_CONTENT';

export const STATE_NOTHING: 'nothing' = 'nothing';
export const STATE_LOADING: 'loading' = 'loading';
export const STATE_READY: 'ready' = 'ready';
export const JOIN_COLONY: 'JOIN_COLONY' = 'JOIN_COLONY';
export const ADD_DOMAIN_TO_COLONY = 'ADD_DOMAIN_TO_COLONY';
export const ADD_TASK_TO_DOMAIN = 'ADD_TASK_TO_DOMAIN';
export const ADD_COMMENT_TO_TASK = 'ADD_COMMENT_TO_TASK';

export const INITIALIZE_DATA = 'INITIALIZE_DATA';

type State =
  | typeof STATE_NOTHING
  | typeof STATE_LOADING
  | typeof STATE_READY
  | { my_profile: {} | string };

type UserProfile = {
  colonies: [],
  avatar: string,
};

export type DataReduxStore = {
  state: State,
  data: any, // @TODO
  my_profile: {
    state: State,
    data: any, // @TODO
  },
};

export const INITIAL_STATE: DataReduxStore = {
  state: STATE_NOTHING,
  data: {
    colonies: { mycolony: { domains: [] } },
    domains: { mydomain: { tasks: [] } },
  },
  my_profile: {
    state: STATE_NOTHING,
    data: { colonies: [] },
  },
};

export type Action = { type: string, state: State, data: ?{}, content: ?{} };
