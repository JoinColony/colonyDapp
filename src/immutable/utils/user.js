/* @flow */

import type { UserType, UserRecordType } from '../User';

// TODO probably move this to a selector, or elsewhere
// eslint-disable-next-line import/prefer-default-export
export const userDidClaimProfile = ({
  profile: { username },
}: UserType | UserRecordType) => !!username;
