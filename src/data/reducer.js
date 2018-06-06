/* @flow */
const SET_DATA_STATE = 'SET_DATA_STATE';
const SET_PROFILE_STATE = 'SET_PROFILE_STATE';
const SET_PROFILE_CONTENT = 'SET_PROFILE_CONTENT';

export const STATE_NOTHING: string = 'nothing';
export const STATE_LOADING: string = 'loading';
export const STATE_READY: string = 'ready';

type State = STATE_NOTHING | STATE_LOADING | STATE_READY;

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

export function actionLoadState() {
  return {
    type: SET_DATA_STATE,
    state: STATE_LOADING,
    data: null,
  };
}

export function actionDataReady(data) {
  return {
    type: SET_DATA_STATE,
    state: STATE_READY,
    data,
  };
}

export function actionUserProfileReady(data) {
  return {
    type: SET_PROFILE_STATE,
    state: STATE_READY,
    data,
  };
}

export function actionSetUserProfileContent(content) {
  return {
    type: SET_PROFILE_CONTENT,
    content,
  };
}

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_DATA_STATE:
      return { ...state, state: action.state, data: action.data };
    case SET_PROFILE_STATE:
      return {
        ...state,
        my_profile: {
          ...state.my_profile,
          state: action.state,
          data: action.data,
        },
      };
    case SET_PROFILE_CONTENT:
      return {
        ...state,
        my_profile: { ...state.my_profile, content: action.content },
      };
    default:
      return state;
  }
}
