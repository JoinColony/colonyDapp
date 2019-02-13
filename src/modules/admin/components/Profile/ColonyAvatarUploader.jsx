/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { FileReaderFile } from '~core/FileUpload';

import AvatarUploader from '~core/AvatarUploader';
import ColonyAvatar from '~core/ColonyAvatar';
import { ACTIONS } from '~redux';

import promiseListener from '../../../../createPromiseListener';

import type { AsyncFunction } from '../../../../createPromiseListener';
import type { ColonyType } from '~immutable';

import styles from './ColonyAvatarUploader.css';
import { mergePayload } from '~utils/actions';

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
    const setPayload = (action: *, payload: *) =>
      mergePayload(action, { payload, meta: { keyPath: [props.ensName] } });
    this.remove = promiseListener.createAsyncFunction({
      start: ACTIONS.COLONY_AVATAR_REMOVE,
      resolve: ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS,
      reject: ACTIONS.COLONY_AVATAR_REMOVE_ERROR,
      setPayload,
    });
    this.upload = promiseListener.createAsyncFunction({
      start: ACTIONS.COLONY_AVATAR_UPLOAD,
      resolve: ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS,
      reject: ACTIONS.COLONY_AVATAR_UPLOAD_ERROR,
      setPayload,
    });
  }

  componentWillUnmount() {
    this.remove.unsubscribe();
    this.upload.unsubscribe();
  }

  render() {
    const { address, name, avatar, ensName } = this.props;
    return (
      <AvatarUploader
        label={MSG.labelProfilePicture}
        help={MSG.labelUploader}
        placeholder={
          <ColonyAvatar
            size="xl"
            address={address}
            name={name}
            ensName={ensName}
            avatar={avatar}
            /*
             * @NOTE Unlike other components this does not override the main class
             * But appends the current one to that
             */
            className={styles.main}
          />
        }
        upload={avatarData => this.upload.asyncFunction(avatarData)}
        remove={() => this.remove.asyncFunction({})}
      />
    );
  }
}

export default ColonyAvatarUploader;
