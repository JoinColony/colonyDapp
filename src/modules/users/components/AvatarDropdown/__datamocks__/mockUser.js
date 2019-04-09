/* @flow */
/* eslint-disable max-len */

import { UserRecord, UserProfileRecord } from '~immutable';

const MockUser = UserRecord({
  profile: UserProfileRecord({
    walletAddress: '0x230da0f9u4qtj09ajg240qutgadjf0ajtaj',
    avatarHash: undefined,
    bio:
      'During his life Chewbacca has been many things: Wookiee warrior, ace smuggler and rebel hero. After adventures on Vandor and Kessel, he became Han’s co-pilot.',
    displayName: 'Chewbacca',
    username: 'chewie',
    location: 'Kashyyyk',
    website: 'https://github.com/chewie',
  }),
});

export default MockUser;
