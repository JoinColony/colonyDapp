/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { FileReaderFile } from '~core/FileUpload';
import type { ColonyType } from '~immutable';

import AvatarUploader from '~core/AvatarUploader';
import ColonyAvatarFactory from '~core/ColonyAvatar';
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

const ColonyAvatar = ColonyAvatarFactory({ fetchColony: false });

type Props = {|
  colony: ColonyType,
|};

class ColonyAvatarUploader extends Component<Props> {
  remove: AsyncFunction<Object, empty>;

  upload: AsyncFunction<FileReaderFile, empty>;

  static displayName = 'admin.Profile.ColonyAvatarUploader';

  constructor(props: Props) {
    super(props);
    const setPayload = (originalAction: *, payload: Object) =>
      withKeyPath(props.colony.ensName)()({ ...originalAction, payload });

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
    const { colony } = this.props;
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
            address={colony.address}
            colony={colony}
            size="xl"
          />
        }
        upload={avatarData => this.upload.asyncFunction(avatarData)}
        remove={() => this.remove.asyncFunction({})}
      />
    );
  }
}

export default ColonyAvatarUploader;
