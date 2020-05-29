import { SetupRecord, Setup } from '~immutable/index';

import { ActionTypes, ReducerType } from '~redux/index';

const coreSetupReducer: ReducerType<SetupRecord> = (
  state = Setup(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.SETUP_SAGAS_LOADED:
      return Setup({ contextSagasLoaded: true });
    default:
      return state;
  }
};

export default coreSetupReducer;
