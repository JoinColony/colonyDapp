import { ReducerType, ActionTypes } from '~redux/index';

import {
  FetchableDataRecord,
  NetworkRecord,
  Network,
  FetchableData,
} from '~immutable/index';

import { withFetchableData } from '~utils/reducers';

type State = FetchableDataRecord<NetworkRecord>;

const coreNetworkReducer: ReducerType<State> = (
  state = FetchableData<NetworkRecord>({ record: Network() }),
  action,
) => {
  switch (action.type) {
    case ActionTypes.NETWORK_FETCH_SUCCESS:
      return state.set('record', Network(action.payload));
    default:
      return state;
  }
};

export default withFetchableData<State>(ActionTypes.NETWORK_FETCH)(
  coreNetworkReducer,
);
