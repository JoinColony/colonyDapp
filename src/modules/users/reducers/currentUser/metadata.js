/* @flow */

import { UserMetadataRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { UserMetadataRecordType } from '~immutable';
import type { ReducerType } from '~redux';

// TODO in #755 (user logout) unset this state
const currentUserMetadataReducer: ReducerType<
  UserMetadataRecordType,
  {|
    USER_METADATA_SET: *,
  |},
> = (state = UserMetadataRecord(), action) => {
  switch (action.type) {
    case ACTIONS.USER_METADATA_SET:
      return state.merge(action.payload);
    default:
      return state;
  }
};

export default currentUserMetadataReducer;
