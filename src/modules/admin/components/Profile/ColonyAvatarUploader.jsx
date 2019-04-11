/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { ColonyType } from '~immutable';

import { ACTIONS } from '~redux';
import { withKeyPath } from '~utils/actions';
import { useAsyncFunction } from '~utils/hooks';
import AvatarUploader from '~core/AvatarUploader';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';

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

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

type Props = {|
  colony: ColonyType,
|};

const displayName = 'admin.Profile.ColonyAvatarUploader';

const uploadActions = {
  submit: ACTIONS.COLONY_AVATAR_UPLOAD,
  success: ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS,
  error: ACTIONS.COLONY_AVATAR_UPLOAD_ERROR,
};

const removeActions = {
  submit: ACTIONS.COLONY_AVATAR_REMOVE,
  success: ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS,
  error: ACTIONS.COLONY_AVATAR_REMOVE_ERROR,
};

const ColonyAvatarUploader = ({ colony }: Props) => {
  const transform = withKeyPath(colony.colonyName);
  const upload = useAsyncFunction({ ...uploadActions, transform });
  const remove = useAsyncFunction({ ...removeActions, transform });

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
          address={colony.colonyAddress}
          colony={colony}
          size="xl"
        />
      }
      upload={upload}
      remove={remove}
    />
  );
};

ColonyAvatarUploader.displayName = displayName;

export default ColonyAvatarUploader;
