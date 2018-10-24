// @flow
import { EDIT_USER_PROFILE } from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const updateUserProfile = (currentAddress: String, update: Object) => ({
  type: EDIT_USER_PROFILE,
  payload: { currentAddress, update },
});
