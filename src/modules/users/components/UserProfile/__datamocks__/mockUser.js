/* @flow */
/* eslint-disable max-len */

import type { UserType } from '~immutable';

const MockUser: UserType = {
  profile: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    avatarHash: undefined,
    bio:
      'During his life Chewbacca has been many things: Wookiee warrior, ace smuggler and rebel hero. After adventures on Vandor and Kessel, he became Han’s co-pilot.',
    displayName: 'Chewbacca',
    username: 'chewie',
    location: 'Kashyyyk',
    website: 'https://github.com/chewie',
  },
  activities: [],
};

export default MockUser;
