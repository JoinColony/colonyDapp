import { Map as ImmutableMap, Record } from 'immutable';

import createSandbox from 'jest-sandbox';

import withDataRecordMap from '../withDataRecordMap';

describe('reducers - withDataRecordMap', () => {
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

    // The reducer actions
    const MY_FETCH = 'MY_FETCH';
    const MY_FETCH_ERROR = 'MY_FETCH_ERROR';
    const MY_FETCH_SUCCESS = 'MY_FETCH_SUCCESS';
    const MY_OTHER_ACTION = 'MY_OTHER_ACTION';

    const successReducerAction = sandbox.fn(
      (state, { meta: { key }, payload }) =>
        state.setIn([key, 'record'], MyRecord(payload)),
    );

    const otherReducerAction = sandbox.fn(
      (state, { meta: { key }, payload: { c } }) =>
        state.setIn([key, 'record', 'c'], c),
    );

    // Create a reducer we can wrap
    const myReducer = sandbox.fn((state, action) => {
      switch (action.type) {
        case MY_FETCH_SUCCESS:
          return successReducerAction(state, action);
        case MY_OTHER_ACTION:
          return otherReducerAction(state, action);
        default:
          return state;
      }
    });

    // @ts-ignore
    const myWrappedReducer = withDataRecordMap(MY_FETCH, ImmutableMap())(
      myReducer,
    );

    const initialState = ImmutableMap();

    const fetchAction = {
      type: MY_FETCH,
      meta: { key: 'myKey' },
    };

    const errorAction = {
      type: MY_FETCH_ERROR,
      error: true,
      meta: { key: 'myKey' },
      payload: {
        message: 'fetch error',
      },
    };

    const successAction = {
      type: MY_FETCH_SUCCESS,
      meta: { key: 'myKey' },
      payload: { a: 1, b: 1 },
    };

    const otherAction = {
      type: MY_OTHER_ACTION,
      meta: { key: 'myKey' },
      payload: { c: 1 },
    };

    // Actions: fetch, success and other
    {
      const fetchState = myWrappedReducer(initialState, fetchAction);
      expect(fetchState.has('myKey')).toBe(true);
      expect(fetchState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: undefined,
        isFetching: true,
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(initialState, fetchAction);
      expect(successReducerAction).not.toHaveBeenCalled();
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
        lastFetchedAt: expect.any(Date),
      });
      expect(successReducerAction).toHaveBeenCalledWith(
        fetchState,
        successAction,
      );
      expect(myReducer).toHaveBeenCalledWith(fetchState, successAction);
      myReducer.mockClear();
      successReducerAction.mockClear();

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
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(successState, otherAction);
      expect(successReducerAction).not.toHaveBeenCalled();
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
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(initialState, fetchAction);
      expect(successReducerAction).not.toHaveBeenCalled();
      myReducer.mockClear();

      const errorState = myWrappedReducer(fetchState, errorAction);
      expect(errorState.has('myKey')).toBe(true);
      expect(errorState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: 'fetch error',
        isFetching: false,
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(fetchState, errorAction);
      expect(successReducerAction).not.toHaveBeenCalled();
      myReducer.mockClear();
    }

    // Actions: fetch, error, success
    {
      const fetchState = myWrappedReducer(initialState, fetchAction);
      expect(fetchState.has('myKey')).toBe(true);
      expect(myReducer).toHaveBeenCalledWith(initialState, fetchAction);
      expect(successReducerAction).not.toHaveBeenCalled();
      myReducer.mockClear();

      const errorState = myWrappedReducer(fetchState, errorAction);
      expect(errorState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: 'fetch error',
        isFetching: false,
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(fetchState, errorAction);
      expect(successReducerAction).not.toHaveBeenCalled();
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
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(errorState, successAction);
      expect(successReducerAction).toHaveBeenCalledWith(
        errorState,
        successAction,
      );
      myReducer.mockClear();
      successReducerAction.mockClear();
    }

    // Actions: Multiple fetch/success
    {
      const fetchOneState = myWrappedReducer(initialState, fetchAction);
      expect(fetchOneState.has('myKey')).toBe(true);
      expect(fetchOneState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: undefined,
        isFetching: true,
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(initialState, fetchAction);
      expect(successReducerAction).not.toHaveBeenCalled();
      myReducer.mockClear();

      const fetchTwoState = myWrappedReducer(fetchOneState, fetchAction);
      expect(fetchTwoState.has('myKey')).toBe(true);
      expect(fetchTwoState.get('myKey').toJS()).toEqual({
        record: undefined,
        error: undefined,
        isFetching: true,
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(fetchOneState, fetchAction);
      expect(successReducerAction).not.toHaveBeenCalled();
      myReducer.mockClear();

      const successOneAction = {
        type: MY_FETCH_SUCCESS,
        meta: { key: 'myKey' },
        payload: { a: 20 },
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
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(fetchTwoState, successOneAction);
      expect(successReducerAction).toHaveBeenCalledWith(
        fetchTwoState,
        successOneAction,
      );
      myReducer.mockClear();
      successReducerAction.mockClear();

      const successTwoAction = {
        type: MY_FETCH_SUCCESS,
        meta: { key: 'myKey' },
        payload: { b: 2000 },
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
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(successOneState, successTwoAction);
      expect(successReducerAction).toHaveBeenCalledWith(
        successOneState,
        successTwoAction,
      );
      myReducer.mockClear();
      successReducerAction.mockClear();

      // An unexpected success action
      const successThreeAction = {
        type: MY_FETCH_SUCCESS,
        meta: { key: 'myKey' },
        payload: { a: 5000 },
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
        lastFetchedAt: expect.any(Date),
      });
      expect(myReducer).toHaveBeenCalledWith(
        successTwoState,
        successThreeAction,
      );
      expect(successReducerAction).toHaveBeenCalledWith(
        successTwoState,
        successThreeAction,
      );
      myReducer.mockClear();
      successReducerAction.mockClear();
    }
  });
});
