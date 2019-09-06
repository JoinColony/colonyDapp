import { ReducerType, ActionTypes } from '~redux/index';

import {
  FetchableDataRecord,
  NetworkRecordType,
  NetworkRecord,
  FetchableData,
} from '~immutable/index';

import { withFetchableData } from '~utils/reducers';

type State = FetchableDataRecord<NetworkRecordType>;

const coreNetworkReducer: ReducerType<State> = (
  state = FetchableData<NetworkRecordType>({ record: NetworkRecord() }),
  action,
) => {
  switch (action.type) {
    case ActionTypes.NETWORK_FETCH_SUCCESS:
      return state.set('record', NetworkRecord(action.payload));
    default:
      return state;
  }
};

export default withFetchableData<State>(ActionTypes.NETWORK_FETCH)(
  coreNetworkReducer,
);
