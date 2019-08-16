import { ReducerType, ActionTypes } from '~redux/index';

import {
  DataRecordType,
  NetworkRecordType,
  NetworkRecord,
  DataRecord,
} from '~immutable/index';

import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<NetworkRecordType>;

const coreNetworkReducer: ReducerType<State> = (
  state = DataRecord<NetworkRecordType>({ record: NetworkRecord() }),
  action,
) => {
  switch (action.type) {
    case ActionTypes.NETWORK_FETCH_SUCCESS:
      return state.set('record', NetworkRecord(action.payload));
    default:
      return state;
  }
};

export default withDataRecord<State>(ActionTypes.NETWORK_FETCH)(
  coreNetworkReducer,
);
