export const SET_DATA_STATE = 'SET_DATA_STATE';
export const SET_PROFILE_STATE = 'SET_PROFILE_STATE';
export const SET_PROFILE_CONTENT = 'SET_PROFILE_CONTENT';

export const STATE_NOTHING: 'nothing' = 'nothing';
export const STATE_LOADING: 'loading' = 'loading';
export const STATE_READY: 'ready' = 'ready';
export const JOIN_COLONY: 'JOIN_COLONY' = 'JOIN_COLONY';

export const INITIALIZE_DATA = 'INITIALIZE_DATA';

type State =
  | typeof STATE_NOTHING
  | typeof STATE_LOADING
  | typeof STATE_READY
  | { my_profile: {} | string };

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
  data: null,
  my_profile: {
    state: STATE_NOTHING,
    data: null,
  },
};

export type Action = { type: string, state: State, data: ?{}, content: ?{} };
