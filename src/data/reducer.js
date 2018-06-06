/* @flow */
const SET_DATA_STATE = 'SET_DATA_STATE';

export const STATE_NOTHING: string = 'nothing';
export const STATE_LOADING: string = 'loading';
export const STATE_READY: string = 'ready';

type State = STATE_NOTHING | STATE_LOADING | STATE_READY;

export type DataReduxStore = {
  state: State,
  data: any,
};

export const INITIAL_STATE: DataReduxStore = {
  state: STATE_NOTHING,
  data: null,
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

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_DATA_STATE:
      return { ...state, state: action.state, data: action.data };
    default:
      return state;
  }
}
