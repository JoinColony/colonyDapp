import { Record, Map as ImmutableMap } from 'immutable';
import createSandbox from 'jest-sandbox';

import withDataReducer from '../withDataReducer';

describe('reducers - withDataReducer', () => {
  const sandbox = createSandbox();

  beforeEach(() => {
    sandbox.clear();
  });

  test('It should maintain data loading state', () => {
    const defaultValues = {
      a: 0,
      b: 0,
      c: undefined,
    };

    const MyRecord = Record(defaultValues);

    const myReducer = sandbox.fn((state, action) => {
      switch (action.type) {
        case 'MY_OTHER_ACTION': {
          const { key, c } = action.payload;
          return state.setIn([key, 'data', 'c'], c);
        }
        default:
          return state;
      }
    });

    const myActions = {
      fetch: 'MY_FETCH_ACTION',
      error: 'MY_FETCH_ERROR_ACTION',
      success: 'MY_FETCH_SUCCESS_ACTION',
    };

    const myReducerWithData = withDataReducer(myActions, MyRecord)(myReducer);

    const initialState = new ImmutableMap();

    const fetchAction = {
      type: myActions.fetch,
      payload: { key: 'myKey' },
    };

    const errorAction = {
      type: myActions.error,
      payload: { key: 'myKey', error: 'fetch error' },
    };

    const successAction = {
      type: myActions.success,
      payload: { key: 'myKey', data: { a: 1, b: 1 } },
    };

    const otherAction = {
      type: 'MY_OTHER_ACTION',
      payload: { key: 'myKey', c: 1 },
    };

    // Actions: fetch, success and other
    {
      const fetchState = myReducerWithData(initialState, fetchAction);
      expect(fetchState.has('myKey')).toBe(true);
      expect(fetchState.get('myKey').toJS()).toEqual({
        data: { a: 0, b: 0, c: undefined },
        error: undefined,
        fetching: 1,
      });
      expect(myReducer).toHaveBeenCalledWith(fetchState, fetchAction);
      myReducer.mockClear();

      const successState = myReducerWithData(fetchState, successAction);
      expect(successState.has('myKey')).toBe(true);
      expect(successState.get('myKey').toJS()).toEqual({
        data: { a: 1, b: 1, c: undefined },
        error: undefined,
        fetching: 0,
      });
      expect(myReducer).toHaveBeenCalledWith(successState, successAction);
      myReducer.mockClear();

      const otherState = myReducerWithData(successState, otherAction);
      expect(otherState.has('myKey')).toBe(true);
      expect(otherState.get('myKey').toJS()).toEqual({
        data: { a: 1, b: 1, c: 1 },
        error: undefined,
        fetching: 0,
      });
      expect(myReducer).toHaveBeenCalledWith(successState, otherAction);
      myReducer.mockClear();
    }

    // Actions: fetch and error
    {
      const fetchState = myReducerWithData(initialState, fetchAction);
      expect(fetchState.has('myKey')).toBe(true);
      expect(fetchState.get('myKey').toJS()).toEqual({
        data: { a: 0, b: 0, c: undefined },
        error: undefined,
        fetching: 1,
      });
      expect(myReducer).toHaveBeenCalledWith(fetchState, fetchAction);
      myReducer.mockClear();

      const errorState = myReducerWithData(fetchState, errorAction);
      expect(errorState.has('myKey')).toBe(true);
      expect(errorState.get('myKey').toJS()).toEqual({
        data: { a: 0, b: 0, c: undefined },
        error: 'fetch error',
        fetching: 0,
      });
      expect(myReducer).toHaveBeenCalledWith(errorState, errorAction);
      myReducer.mockClear();
    }

    // Actions: fetch, error, success
    {
      const fetchState = myReducerWithData(initialState, fetchAction);
      expect(fetchState.has('myKey')).toBe(true);
      expect(myReducer).toHaveBeenCalledWith(fetchState, fetchAction);
      myReducer.mockClear();

      const errorState = myReducerWithData(fetchState, errorAction);
      expect(errorState.get('myKey').toJS()).toEqual({
        data: { a: 0, b: 0, c: undefined },
        error: 'fetch error',
        fetching: 0,
      });
      expect(myReducer).toHaveBeenCalledWith(errorState, errorAction);
      myReducer.mockClear();

      const successState = myReducerWithData(errorState, successAction);
      expect(successState.get('myKey').toJS()).toEqual({
        data: { a: 1, b: 1, c: undefined },
        error: undefined, // removed
        fetching: 0,
      });
      expect(myReducer).toHaveBeenCalledWith(successState, successAction);
      myReducer.mockClear();
    }

    // Actions: Multiple fetch/success
    {
      const fetchOneState = myReducerWithData(initialState, fetchAction);
      expect(fetchOneState.has('myKey')).toBe(true);
      expect(fetchOneState.get('myKey').toJS()).toEqual({
        data: { a: 0, b: 0, c: undefined },
        error: undefined,
        fetching: 1, // incremented once
      });
      expect(myReducer).toHaveBeenCalledWith(fetchOneState, fetchAction);
      myReducer.mockClear();

      const fetchTwoState = myReducerWithData(fetchOneState, fetchAction);
      expect(fetchTwoState.has('myKey')).toBe(true);
      expect(fetchTwoState.get('myKey').toJS()).toEqual({
        data: { a: 0, b: 0, c: undefined },
        error: undefined,
        fetching: 2, // incremented again
      });
      expect(myReducer).toHaveBeenCalledWith(fetchTwoState, fetchAction);
      myReducer.mockClear();

      const successOneAction = {
        type: myActions.success,
        payload: { key: 'myKey', data: { a: 20 } },
      };
      const successOneState = myReducerWithData(
        fetchTwoState,
        successOneAction,
      );
      expect(successOneState.get('myKey').toJS()).toEqual({
        data: { a: 20, b: 0, c: undefined },
        error: undefined,
        fetching: 1, // still one remaining
      });
      expect(myReducer).toHaveBeenCalledWith(successOneState, successOneAction);
      myReducer.mockClear();

      const successTwoAction = {
        type: myActions.success,
        payload: { key: 'myKey', data: { b: 2000 } },
      };
      const successTwoState = myReducerWithData(
        successOneState,
        successTwoAction,
      );
      expect(successTwoState.get('myKey').toJS()).toEqual({
        data: { a: 20, b: 2000, c: undefined },
        error: undefined,
        fetching: 0, // done!
      });
      expect(myReducer).toHaveBeenCalledWith(successTwoState, successTwoAction);
      myReducer.mockClear();

      // An unexpected success action
      const successThreeAction = {
        type: myActions.success,
        payload: { key: 'myKey', data: { a: 5000 } },
      };
      const successThreeState = myReducerWithData(
        successTwoState,
        successThreeAction,
      );
      expect(successThreeState.get('myKey').toJS()).toEqual({
        data: { a: 5000, b: 2000, c: undefined },
        error: undefined,
        fetching: 0, // should not have decreased below 0
      });
      expect(myReducer).toHaveBeenCalledWith(
        successThreeState,
        successThreeAction,
      );
      myReducer.mockClear();
    }
  });
});
