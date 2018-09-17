/* @flow */

import React from 'react';

import getIcon from '../../../../lib/identicon';

import Avatar from '../Avatar';

type Props = {
  /** Avatar image URL (can be a base64 encoded string) */
  avatarURL?: ?string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /** For the title */
  username: string,
  /** Address of the current user for identicon fallback */
  walletAddress: string,
};

const UserAvatar = ({
  avatarURL,
  className,
  notSet,
  size,
  username,
  walletAddress,
}: Props) => (
  <Avatar
    avatarURL={avatarURL || (!notSet ? getIcon(walletAddress) : null)}
    className={className}
    notSet={notSet}
    placeholderIcon="circle-person"
    size={size}
    title={username}
  />
);

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
