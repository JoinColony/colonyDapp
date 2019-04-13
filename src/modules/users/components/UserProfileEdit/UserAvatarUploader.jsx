/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { UserType } from '~immutable';
import { useAsyncFunction } from '~utils/hooks';

import AvatarUploader from '~core/AvatarUploader';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { ACTIONS } from '~redux';

const MSG = defineMessages({
  uploaderLabel: {
    id: 'users.UserProfileEdit.UserAvatarUploader',
    defaultMessage: 'At least 250x250px, up to 2MB',
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

type Props = {|
  /** Current user */
  user: UserType,
|};

const uploadActions = {
  submit: ACTIONS.USER_AVATAR_UPLOAD,
  success: ACTIONS.USER_AVATAR_UPLOAD_SUCCESS,
  error: ACTIONS.USER_AVATAR_UPLOAD_ERROR,
};

const removeActions = {
  submit: ACTIONS.USER_AVATAR_REMOVE,
  success: ACTIONS.USER_AVATAR_REMOVE_SUCCESS,
  error: ACTIONS.USER_AVATAR_UPLOAD_ERROR,
};

const displayName = 'users.UserProfileEdit.UserAvatarUploader';

const UserAvatarUploader = ({ user }: Props) => {
  const upload = useAsyncFunction(uploadActions);
  const remove = useAsyncFunction(removeActions);

  return (
    <AvatarUploader
      label={MSG.uploaderLabel}
      placeholder={
        <UserAvatar
          address={user.profile.walletAddress}
          user={user}
          size="xl"
        />
      }
      upload={upload}
      remove={remove}
    />
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
