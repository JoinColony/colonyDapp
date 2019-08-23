import localforage from 'localforage';
import debounce from 'lodash/debounce';

import { Action, ActionTypes } from '~redux/index';

type Config = {
  key: string;
  version: number;
};

const persistState = debounce(state => {
  const stateString = JSON.stringify(state);
  localforage.setItem(`redux:persist:${state.key}`, stateString).catch(err => {
    console.warn(
      `Could not persist state with key ${state.key}. Error: ${err}`,
    );
  });
}, 1000);

const persistReducer = (
  { version, key }: Config,
  reducer: (state: any, action: Action<any>) => any,
) => (state: any, action: Action<any>) => {
  const newState = reducer(state, action);
  if (!state || newState === state || action.type === ActionTypes.REHYDRATED) {
    return newState;
  }
  const wrappedState = {
    key,
    version,
    value: newState,
  };
  persistState(wrappedState);
  return newState;
};

export default persistReducer;
