/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { DataRecord } from '~immutable';

import type { IpfsDataType } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';

import { ACTIONS } from '~redux';

import type { ReducerType } from '~redux';

const ipfsDatasReducer: ReducerType<
  IpfsDataType,
  {|
    IPFS_DATA_FETCH_SUCCESS: *,
    IPFS_DATA_UPLOAD_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.IPFS_DATA_UPLOAD_SUCCESS:
    case ACTIONS.IPFS_DATA_FETCH_SUCCESS: {
      const { ipfsHash, ipfsData } = action.payload;
      return state.getIn([ipfsHash, 'record'])
        ? state
        : state.set(ipfsHash, DataRecord({ record: ipfsData }));
    }
    default:
      return state;
  }
};

export default withDataRecordMap<IpfsDataType, string>(
  ACTIONS.IPFS_DATA_FETCH,
  ImmutableMap(),
)(ipfsDatasReducer);
