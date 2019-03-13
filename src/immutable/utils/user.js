/* @flow */

import type { UserType, UserRecordType } from '../User';

// eslint-disable-next-line import/prefer-default-export
export const userDidClaimProfile = ({
  profile: { username },
}: UserType | UserRecordType) => !!username;
