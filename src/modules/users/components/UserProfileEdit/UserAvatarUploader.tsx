import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import { FileReaderFile } from '~core/FileUpload';
import { AnyUser } from '~data/index';
import { useAsyncFunction } from '~utils/hooks';
import AvatarUploader from '~core/AvatarUploader';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { ActionTypes } from '~redux/index';
import { InputStatus } from '~core/Fields';

import styles from './UserAvatarUploader.css';

const MSG = defineMessages({
  uploaderLabel: {
    id: 'users.UserProfileEdit.UserAvatarUploader.uploaderLabel',
    defaultMessage: 'At least 250x250px, up to 1MB, .png or .svg',
  },
  avatarFileError: {
    id: 'users.UserProfileEdit.UserAvatarUploader.avatarFileError',
    defaultMessage: 'This filetype is not allowed or file is too big',
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

  const [avatarFileError, setAvatarFileError] = useState(false);

  const handleUpload = async (fileData: FileReaderFile) => {
    setAvatarFileError(false);
    return upload(fileData);
  };

  const handleError = async () => {
    setAvatarFileError(true);
  };

  return (
    <>
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
        upload={handleUpload}
        remove={remove}
        isSet={user && user.profile && !!user.profile.avatarHash}
        handleError={handleError}
      />
      {avatarFileError && (
        <div className={styles.inputStatus}>
          <InputStatus error={MSG.avatarFileError} />
        </div>
      )}
    </>
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
