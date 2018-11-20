/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { FileReaderFile } from '~core/FileUpload';

import AvatarUploader from '~core/AvatarUploader';
import UserAvatar from '~core/UserAvatar';

import promiseListener from '../../../../createPromiseListener';

import {
  USER_UPLOAD_AVATAR,
  USER_UPLOAD_AVATAR_SUCCESS,
  USER_UPLOAD_AVATAR_ERROR,
  USER_REMOVE_AVATAR,
  USER_REMOVE_AVATAR_SUCCESS,
  USER_REMOVE_AVATAR_ERROR,
} from '../../actionTypes';

const MSG = defineMessages({
  uploaderLabel: {
    id: 'users.UserProfileEdit.UserAvatarUploader',
    defaultMessage: 'At least 250x250px, up to 2MB',
  },
});

type Props = {
  /** Address of the current user for identicon fallback */
  walletAddress: string,
  /** For UserAvatar title */
  username: string,
};

class UserAvatarUploader extends Component<Props> {
  remove: () => Promise<empty>;

  upload: (file: FileReaderFile) => Promise<empty>;

  static displayName = 'users.UserProfileEdit.UserAvatarUploader';

  constructor(props: Props) {
    super(props);
    this.remove = promiseListener.createAsyncFunction({
      start: USER_REMOVE_AVATAR,
      resolve: USER_REMOVE_AVATAR_SUCCESS,
      reject: USER_REMOVE_AVATAR_ERROR,
    });
    this.upload = promiseListener.createAsyncFunction({
      start: USER_UPLOAD_AVATAR,
      resolve: USER_UPLOAD_AVATAR_SUCCESS,
      reject: USER_UPLOAD_AVATAR_ERROR,
    });
  }

  componentWillUnmount() {
    this.remove.unsubscribe();
    this.upload.unsubscribe();
  }

  render() {
    const { walletAddress, username } = this.props;
    return (
      <AvatarUploader
        label={MSG.uploaderLabel}
        placeholder={
          <UserAvatar
            size="xl"
            title={MSG.uploaderLabel}
            walletAddress={walletAddress}
            username={username}
          />
        }
        upload={this.upload.asyncFunction}
        remove={this.remove.asyncFunction}
      />
    );
  }
}

export default UserAvatarUploader;
