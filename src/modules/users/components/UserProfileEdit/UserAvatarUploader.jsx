/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { UserType } from '~immutable';
import type { FileReaderFile } from '~core/FileUpload';

import AvatarUploader from '~core/AvatarUploader';
import UserAvatarFactory from '~core/UserAvatar';
import { ACTIONS } from '~redux';

import promiseListener from '../../../../createPromiseListener';

import type { AsyncFunction } from '../../../../createPromiseListener';

const MSG = defineMessages({
  uploaderLabel: {
    id: 'users.UserProfileEdit.UserAvatarUploader',
    defaultMessage: 'At least 250x250px, up to 2MB',
  },
});

const UserAvatar = UserAvatarFactory({ fetchUser: false });

type Props = {|
  /** Current user */
  user: UserType,
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
    const { user } = this.props;
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
        upload={this.upload.asyncFunction}
        remove={this.remove.asyncFunction}
      />
    );
  }
}

export default UserAvatarUploader;
