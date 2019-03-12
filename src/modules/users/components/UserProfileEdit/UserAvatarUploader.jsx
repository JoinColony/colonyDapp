/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { FileReaderFile } from '~core/FileUpload';

import AvatarUploader from '~core/AvatarUploader';
import UserAvatar from '~core/UserAvatar';
import { ACTIONS } from '~redux';

import promiseListener from '../../../../createPromiseListener';

import type { AsyncFunction } from '../../../../createPromiseListener';

const MSG = defineMessages({
  uploaderLabel: {
    id: 'users.UserProfileEdit.UserAvatarUploader',
    defaultMessage: 'At least 250x250px, up to 2MB',
  },
});

type Props = {|
  /** Address of the current user for identicon fallback */
  walletAddress: string,
  /** For UserAvatar title */
  username: string,
|};

class UserAvatarUploader extends Component<Props> {
  remove: AsyncFunction<void, empty>;

  upload: AsyncFunction<FileReaderFile, empty>;

  static displayName = 'users.UserProfileEdit.UserAvatarUploader';

  constructor(props: Props) {
    super(props);
    this.remove = promiseListener.createAsyncFunction({
      start: ACTIONS.USER_REMOVE_AVATAR,
      resolve: ACTIONS.USER_REMOVE_AVATAR_SUCCESS,
      reject: ACTIONS.USER_REMOVE_AVATAR_ERROR,
    });
    this.upload = promiseListener.createAsyncFunction({
      start: ACTIONS.USER_UPLOAD_AVATAR,
      resolve: ACTIONS.USER_UPLOAD_AVATAR_SUCCESS,
      reject: ACTIONS.USER_UPLOAD_AVATAR_ERROR,
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
            address={walletAddress}
            size="xl"
            // TODO why is this here? title={MSG.uploaderLabel}
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
