import { Map as ImmutableMap, Record } from 'immutable';
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

    // Create a record factory
    const MyRecord = Record(defaultValues);

    // Create a reducer we can wrap
    const myReducer = sandbox.fn((state, action) => {
      switch (action.type) {
        case 'MY_OTHER_ACTION': {
          const { key, c } = action.payload;
          return state.setIn([key, 'record', 'c'], c);
        }
        default:
          return state;
      }
    });

    // The reducer actions
    const MY_FETCH_ACTION = 'MY_FETCH_ACTION';
    const MY_FETCH_ERROR_ACTION = 'MY_FETCH_ERROR_ACTION';
    const MY_FETCH_SUCCESS_ACTION = 'MY_FETCH_SUCCESS_ACTION';
    const MY_OTHER_ACTION = 'MY_OTHER_ACTION';

    // The `withDataReducer` spec
    const successReducer = sandbox.fn((state, { payload: { key, props } }) =>
      state.setIn([key, 'record'], MyRecord(props)),
    );
    const spec = {
      fetch: MY_FETCH_ACTION,
      error: MY_FETCH_ERROR_ACTION,
      success: new Map([[MY_FETCH_SUCCESS_ACTION, successReducer]]),
    };

    const myWrappedReducer = withDataReducer(spec, MyRecord)(myReducer);

    const initialState = new ImmutableMap();

    const fetchAction = {
      type: MY_FETCH_ACTION,
      payload: { key: 'myKey' },
    };

    const errorAction = {
      type: MY_FETCH_ERROR_ACTION,
      payload: { meta: { key: 'myKey' }, error: { id: 'fetch error' } },
    };

    const successAction = {
      type: MY_FETCH_SUCCESS_ACTION,
      payload: { key: 'myKey', props: { a: 1, b: 1 } },
    };

    const otherAction = {
      type: MY_OTHER_ACTION,
      payload: { key: 'myKey', c: 1 },
    };

    // Actions: fetch, success and other
    {
      const fetchState = myWrappedReducer(initialState, fetchAction);
      expect(fetchState.has('myKey')).toBe(true);
      expect(fetchState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: undefined,
        isFetching: true,
      });
      expect(myReducer).toHaveBeenCalledWith(fetchState, fetchAction);
      expect(successReducer).not.toHaveBeenCalled();
      myReducer.mockClear();

      const successState = myWrappedReducer(fetchState, successAction);
      expect(successState.has('myKey')).toBe(true);
      expect(successState.get('myKey').toJS()).toEqual({
        record: {
          a: 1,
          b: 1,
          c: undefined,
        },
        error: undefined,
        isFetching: false,
      });
      expect(myReducer).toHaveBeenCalledWith(successState, successAction);
      expect(successReducer).toHaveBeenCalledWith(fetchState, successAction);
      myReducer.mockClear();
      successReducer.mockClear();

      const otherState = myWrappedReducer(successState, otherAction);
      expect(otherState.has('myKey')).toBe(true);
      expect(otherState.get('myKey').toJS()).toEqual({
        record: {
          a: 1,
          b: 1,
          c: 1,
        },
        error: undefined,
        isFetching: false,
      });
      expect(myReducer).toHaveBeenCalledWith(successState, otherAction);
      expect(successReducer).not.toHaveBeenCalled();
      myReducer.mockClear();
    }

    // Actions: fetch and error
    {
      const fetchState = myWrappedReducer(initialState, fetchAction);
      expect(fetchState.has('myKey')).toBe(true);
      expect(fetchState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: undefined,
        isFetching: true,
      });
      expect(myReducer).toHaveBeenCalledWith(fetchState, fetchAction);
      expect(successReducer).not.toHaveBeenCalled();
      myReducer.mockClear();

      const errorState = myWrappedReducer(fetchState, errorAction);
      expect(errorState.has('myKey')).toBe(true);
      expect(errorState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: 'fetch error',
        isFetching: false,
      });
      expect(myReducer).toHaveBeenCalledWith(errorState, errorAction);
      expect(successReducer).not.toHaveBeenCalled();
      myReducer.mockClear();
    }

    // Actions: fetch, error, success
    {
      const fetchState = myWrappedReducer(initialState, fetchAction);
      expect(fetchState.has('myKey')).toBe(true);
      expect(myReducer).toHaveBeenCalledWith(fetchState, fetchAction);
      expect(successReducer).not.toHaveBeenCalled();
      myReducer.mockClear();

      const errorState = myWrappedReducer(fetchState, errorAction);
      expect(errorState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: 'fetch error',
        isFetching: false,
      });
      expect(myReducer).toHaveBeenCalledWith(errorState, errorAction);
      expect(successReducer).not.toHaveBeenCalled();
      myReducer.mockClear();

      const successState = myWrappedReducer(errorState, successAction);
      expect(successState.get('myKey').toJS()).toEqual({
        record: {
          a: 1,
          b: 1,
          c: undefined,
        },
        error: undefined, // removed
        isFetching: false,
      });
      expect(myReducer).toHaveBeenCalledWith(successState, successAction);
      expect(successReducer).toHaveBeenCalledWith(errorState, successAction);
      myReducer.mockClear();
      successReducer.mockClear();
    }

    // Actions: Multiple fetch/success
    {
      const fetchOneState = myWrappedReducer(initialState, fetchAction);
      expect(fetchOneState.has('myKey')).toBe(true);
      expect(fetchOneState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: undefined,
        isFetching: true,
      });
      expect(myReducer).toHaveBeenCalledWith(fetchOneState, fetchAction);
      expect(successReducer).not.toHaveBeenCalled();
      myReducer.mockClear();

      const fetchTwoState = myWrappedReducer(fetchOneState, fetchAction);
      expect(fetchTwoState.has('myKey')).toBe(true);
      expect(fetchTwoState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: undefined,
        isFetching: true,
      });
      expect(myReducer).toHaveBeenCalledWith(fetchTwoState, fetchAction);
      expect(successReducer).not.toHaveBeenCalled();
      myReducer.mockClear();

      const successOneAction = {
        type: MY_FETCH_SUCCESS_ACTION,
        payload: { key: 'myKey', props: { a: 20 } },
      };
      const successOneState = myWrappedReducer(fetchTwoState, successOneAction);
      expect(successOneState.get('myKey').toJS()).toEqual({
        record: {
          a: 20,
          b: 0,
          c: undefined,
        },
        error: undefined,
        isFetching: false,
      });
      expect(myReducer).toHaveBeenCalledWith(successOneState, successOneAction);
      expect(successReducer).toHaveBeenCalledWith(
        fetchTwoState,
        successOneAction,
      );
      myReducer.mockClear();
      successReducer.mockClear();

      const successTwoAction = {
        type: MY_FETCH_SUCCESS_ACTION,
        payload: { key: 'myKey', props: { b: 2000 } },
      };
      const successTwoState = myWrappedReducer(
        successOneState,
        successTwoAction,
      );
      expect(successTwoState.get('myKey').toJS()).toEqual({
        record: {
          a: 0, // should have been set to default, because the success reducer does not merge
          b: 2000,
          c: undefined,
        },
        error: undefined,
        isFetching: false,
      });
      expect(myReducer).toHaveBeenCalledWith(successTwoState, successTwoAction);
      expect(successReducer).toHaveBeenCalledWith(
        successOneState,
        successTwoAction,
      );
      myReducer.mockClear();
      successReducer.mockClear();

      // An unexpected success action
      const successThreeAction = {
        type: MY_FETCH_SUCCESS_ACTION,
        payload: { key: 'myKey', props: { a: 5000 } },
      };
      const successThreeState = myWrappedReducer(
        successTwoState,
        successThreeAction,
      );
      expect(successThreeState.get('myKey').toJS()).toEqual({
        record: {
          a: 5000,
          b: 0, // should have been set to default, because the success reducer does not merge
          c: undefined,
        },
        error: undefined,
        isFetching: false,
      });
      expect(myReducer).toHaveBeenCalledWith(
        successThreeState,
        successThreeAction,
      );
      expect(successReducer).toHaveBeenCalledWith(
        successTwoState,
        successThreeAction,
      );
      myReducer.mockClear();
      successReducer.mockClear();
    }
  });
});
