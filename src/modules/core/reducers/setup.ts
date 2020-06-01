import { SetupRecord, Setup } from '~immutable/index';

import { ActionTypes, ReducerType } from '~redux/index';

const coreSetupReducer: ReducerType<SetupRecord> = (
  state = Setup(),
  action,
) => {
  switch (action.type) {
    /**
     * @NOTE This is needed in oreder to inform the app that all listeners that we
     * depend on were set up.
     * Otherwise we run into race conditions where actions are dispatched but there's
     * no listener set up yet to handle it. (eg: fetch user address)
     */
    case ActionTypes.SETUP_SAGAS_LOADED:
      return Setup({ contextSagasLoaded: true });
    default:
      return state;
  }
};

export default coreSetupReducer;
