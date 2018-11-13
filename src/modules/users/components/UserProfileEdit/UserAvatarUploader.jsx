/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

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

type State = {
  avatarURL: ?string,
};

class UserAvatarUploader extends Component<Props, State> {
  _remove: () => Promise<*>;

  _upload: (file: *) => Promise<*>;

  static displayName = 'users.UserProfileEdit.UserAvatarUploader';

  constructor(props: Props) {
    super(props);
    this.state = {
      avatarURL: null,
    };
    this._remove = promiseListener.createAsyncFunction({
      start: USER_REMOVE_AVATAR,
      resolve: USER_REMOVE_AVATAR_SUCCESS,
      reject: USER_REMOVE_AVATAR_ERROR,
    });
    this._upload = promiseListener.createAsyncFunction({
      start: USER_UPLOAD_AVATAR,
      resolve: USER_UPLOAD_AVATAR_SUCCESS,
      reject: USER_UPLOAD_AVATAR_ERROR,
    });
  }

  componentWillUnmount() {
    this._remove.unsubscribe();
    this._upload.unsubscribe();
  }

  remove = async () => {
    await this._remove.asyncFunction();
    this.setState({
      avatarURL: null,
    });
  };

  upload = async (file: *) => {
    await this._upload.asyncFunction(file);
    this.setState({
      avatarURL: file.data,
    });
    return file.data;
  };

  render() {
    const { walletAddress, username } = this.props;
    const { avatarURL } = this.state;
    return (
      <AvatarUploader
        label={MSG.uploaderLabel}
        placeholder={
          <UserAvatar
            avatarURL={avatarURL}
            size="xl"
            title={MSG.uploaderLabel}
            walletAddress={walletAddress}
            username={username}
          />
        }
        upload={this.upload}
        remove={this.remove}
      />
    );
  }
}

export default UserAvatarUploader;
