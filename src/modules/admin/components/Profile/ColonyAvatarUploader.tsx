import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { ActionTypes } from '~redux/index';
import { pipe, withKey, mergePayload } from '~utils/actions';
import { useAsyncFunction } from '~utils/hooks';
import AvatarUploader from '~core/AvatarUploader';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import { AnyColony } from '~data/index';

import styles from './ColonyAvatarUploader.css';

const MSG = defineMessages({
  labelProfilePicture: {
    id: 'admin.Profile.ColonyAvatarUploader.labelProfilePicture',
    defaultMessage: 'Colony Profile Picture',
  },
  labelUploader: {
    id: 'admin.Profile.ColonyAvatarUploader.labelUploader',
    defaultMessage: '(at least 250px by 250px, up to 1MB)',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

interface Props {
  colony: AnyColony;
}

const displayName = 'admin.Profile.ColonyAvatarUploader';

const uploadActions = {
  submit: ActionTypes.COLONY_AVATAR_UPLOAD,
  success: ActionTypes.COLONY_AVATAR_UPLOAD_SUCCESS,
  error: ActionTypes.COLONY_AVATAR_UPLOAD_ERROR,
};

const removeActions = {
  submit: ActionTypes.COLONY_AVATAR_REMOVE,
  success: ActionTypes.COLONY_AVATAR_REMOVE_SUCCESS,
  error: ActionTypes.COLONY_AVATAR_REMOVE_ERROR,
};

const ColonyAvatarUploader = ({ colony: { colonyAddress }, colony }: Props) => {
  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mergePayload({ colonyAddress }),
    ),
    [colonyAddress],
  );
  const upload = useAsyncFunction({ ...uploadActions, transform }) as any;
  const remove = useAsyncFunction({ ...removeActions, transform }) as any;

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
          colonyAddress={colonyAddress}
          colony={colony}
          size="xl"
        />
      }
      upload={upload}
      remove={remove}
      isSet={colony && !!colony.avatarHash}
    />
  );
};

ColonyAvatarUploader.displayName = displayName;

export default ColonyAvatarUploader;
