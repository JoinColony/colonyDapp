/* @flow */

import React from 'react';

import type { $Pick } from '~types';

import Avatar from '../Avatar';
import getIcon from '../../../../lib/identicon';

import type { Props as ColonyAvatarProps } from './ColonyAvatarFactory.jsx';

type Props = {|
  ...$Pick<
    ColonyAvatarProps,
    { className?: *, notSet?: *, size?: *, colony?: *, address: * },
  >,
  /** Avatar image URL (can be a base64 encoded string) */
  avatar: ?string,
|};

const ColonyAvatar = ({
  address,
  colony,
  avatar,
  size,
  notSet,
  className,
}: Props) => (
  <Avatar
    avatarURL={avatar || getIcon(address)}
    className={className}
    notSet={notSet}
    placeholderIcon="at-sign-circle"
    size={size}
    seed={address}
    title={(colony && (colony.name || colony.ensName)) || address}
  />
);

export default ColonyAvatar;
