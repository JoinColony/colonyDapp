import React from 'react';
import { defineMessages } from 'react-intl';

import { FileReaderFile } from '~core/FileUpload';
import { AnyUser } from '~data/index';
import { useAsyncFunction } from '~utils/hooks';
import AvatarUploader from '~core/AvatarUploader';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { ActionTypes } from '~redux/index';

const MSG = defineMessages({
  uploaderLabel: {
    id: 'users.UserProfileEdit.UserAvatarUploader',
    defaultMessage: 'At least 250x250px, up to 1MB, .png or .svg',
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

interface Props {
  /** Current user */
  user: AnyUser;
}

const uploadActions = {
  submit: ActionTypes.USER_AVATAR_UPLOAD,
  success: ActionTypes.USER_AVATAR_UPLOAD_SUCCESS,
  error: ActionTypes.USER_AVATAR_UPLOAD_ERROR,
};

const removeActions = {
  submit: ActionTypes.USER_AVATAR_REMOVE,
  success: ActionTypes.USER_AVATAR_REMOVE_SUCCESS,
  error: ActionTypes.USER_AVATAR_UPLOAD_ERROR,
};

const displayName = 'users.UserProfileEdit.UserAvatarUploader';

const UserAvatarUploader = ({ user }: Props) => {
  const upload = useAsyncFunction(uploadActions) as (
    fileData: FileReaderFile,
  ) => Promise<string>;
  const remove = useAsyncFunction(removeActions);

  return (
    <AvatarUploader
      label={MSG.uploaderLabel}
      hasButtons
      placeholder={
        <UserAvatar
          address={user.profile.walletAddress}
          user={user}
          size="xl"
          notSet={false}
        />
      }
      upload={upload}
      remove={remove}
      isSet={user && user.profile && !!user.profile.avatarHash}
    />
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
