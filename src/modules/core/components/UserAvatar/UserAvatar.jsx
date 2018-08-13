/* @flow */

import React from 'react';

import Avatar from '../Avatar';

type Props = {
  /** Avatar image URL (can be a base64 encoded string) */
  avatarURL?: string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l',
  /** For the title */
  username: string,
};

const UserAvatar = ({
  avatarURL,
  className,
  notSet,
  size,
  username,
}: Props) => (
  <Avatar
    avatarURL={avatarURL}
    className={className}
    notSet={notSet}
    placeholderIcon="circle-person"
    size={size}
    title={username}
  />
);

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
