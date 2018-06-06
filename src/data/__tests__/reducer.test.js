/* eslint-env jest */
import {
  actionDataReady,
  actionLoadState,
  INITIAL_STATE,
  reducer,
  STATE_LOADING,
  STATE_NOTHING,
  STATE_READY,
} from '../reducer';

const DATA_MOCK = 'data_mock';

describe('Data Reducer Testing', () => {
  it('is sets my data state to loading on boot', async () => {
    expect(INITIAL_STATE.state).toBe(STATE_NOTHING);
    expect(INITIAL_STATE.data).toBeNull();
  });

  it('goes to loading when I load state', async () => {
    const state = reducer(INITIAL_STATE, actionLoadState());

    expect(state.state).toEqual(STATE_LOADING);
    expect(state.data).toBeNull();
  });

  it('goes to ready when state is loaded', async () => {
    const state = reducer(
      reducer(INITIAL_STATE, actionLoadState()),
      actionDataReady(DATA_MOCK),
    );

    expect(state.state).toEqual(STATE_READY);
    expect(state.data).toEqual(DATA_MOCK);
  });
});
