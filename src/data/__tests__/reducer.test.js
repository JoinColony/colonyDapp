/* eslint-env jest */
import {
  dataReady,
  loadState,
  setUserProfileContent,
  userProfileReady,
  INITIAL_STATE,
  reducer,
  STATE_LOADING,
  STATE_NOTHING,
  STATE_READY,
} from '../reducer';

const DATA_MOCK = 'data_mock';
const PROFILE_MOCK = 'profile_mock';
const PROFILE_CONTENT_MOCK = 'profile_content_mock';

describe('Data Reducer Testing', () => {
  it('sets my data state to nothing on boot', () => {
    expect(INITIAL_STATE.state).toBe(STATE_NOTHING);
    expect(INITIAL_STATE.data).toBeNull();
  });

  it('goes to loading when I load state', () => {
    const state = reducer(INITIAL_STATE, loadState());

    expect(state.state).toEqual(STATE_LOADING);
    expect(state.data).toBeNull();
  });

  it('goes to ready when state is loaded', () => {
    const state = reducer(
      reducer(INITIAL_STATE, loadState()),
      dataReady(DATA_MOCK),
    );

    expect(state.state).toEqual(STATE_READY);
    expect(state.data).toEqual(DATA_MOCK);
  });

  it('sets my profile state to nothing on boot', () => {
    expect(INITIAL_STATE.my_profile.state).toEqual(STATE_NOTHING);
    expect(INITIAL_STATE.my_profile.data).toBeNull();
  });

  it('keeps the user profile when loaded', () => {
    const state = reducer(INITIAL_STATE, userProfileReady(PROFILE_MOCK));

    expect(state.my_profile.state).toEqual(STATE_READY);
    expect(state.my_profile.data).toEqual(PROFILE_MOCK);
  });

  it('update the user profile when content is sent', () => {
    const state = reducer(
      INITIAL_STATE,
      setUserProfileContent(PROFILE_CONTENT_MOCK),
    );
    expect(state.my_profile.content).toEqual(PROFILE_CONTENT_MOCK);
  });
});
