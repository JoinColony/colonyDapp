/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { FileReaderFile } from '~core/FileUpload';
import type { ColonyType } from '~immutable';

import AvatarUploader from '~core/AvatarUploader';
import ColonyAvatar from '~core/ColonyAvatar';
import { ACTIONS } from '~redux';
import { withKeyPath } from '~utils/actions';

import promiseListener from '../../../../createPromiseListener';

import type { AsyncFunction } from '../../../../createPromiseListener';

import styles from './ColonyAvatarUploader.css';

const MSG = defineMessages({
  labelProfilePicture: {
    id: 'admin.Profile.ColonyAvatarUploader.labelProfilePicture',
    defaultMessage: 'Colony Profile Picture',
  },
  labelUploader: {
    id: 'admin.Profile.ColonyAvatarUploader.labelUploader',
    defaultMessage: 'at least 250px by 250px, up to 1MB',
  },
});

type Props = {|
  /** Address of the current colony for identicon fallback */
  address: $PropertyType<ColonyType, 'address'>,
  /** For UserAvatar title */
  name: $PropertyType<ColonyType, 'name'>,
  /** Avatar hash */
  avatar: $PropertyType<ColonyType, 'avatar'>,
  ensName: $PropertyType<ColonyType, 'ensName'>,
|};

class ColonyAvatarUploader extends Component<Props> {
  remove: AsyncFunction<Object, empty>;

  upload: AsyncFunction<FileReaderFile, empty>;

  static displayName = 'admin.Profile.ColonyAvatarUploader';

  constructor(props: Props) {
    super(props);
    const setPayload = (originalAction: *, payload: Object) =>
      withKeyPath(props.ensName)()({ ...originalAction, payload });

    this.upload = promiseListener.createAsyncFunction({
      start: ACTIONS.COLONY_AVATAR_UPLOAD,
      resolve: ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS,
      reject: ACTIONS.COLONY_AVATAR_UPLOAD_ERROR,
      setPayload,
    });
    this.remove = promiseListener.createAsyncFunction({
      start: ACTIONS.COLONY_AVATAR_REMOVE,
      resolve: ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS,
      reject: ACTIONS.COLONY_AVATAR_REMOVE_ERROR,
      setPayload,
    });
  }

  componentWillUnmount() {
    this.upload.unsubscribe();
    this.remove.unsubscribe();
  }

  render() {
    const { address, name, avatar, ensName } = this.props;
    return (
      <AvatarUploader
        label={MSG.labelProfilePicture}
        help={MSG.labelUploader}
        placeholder={
          <ColonyAvatar
            /*
             * @NOTE Unlike other components this does not override the main class
             * But appends the current one to that
             */
            className={styles.main}
            size="xl"
            address={address}
            name={name}
            ensName={ensName}
            hash={avatar}
          />
        }
        upload={avatarData => this.upload.asyncFunction(avatarData)}
        remove={() => this.remove.asyncFunction({})}
      />
    );
  }
}

export default ColonyAvatarUploader;
