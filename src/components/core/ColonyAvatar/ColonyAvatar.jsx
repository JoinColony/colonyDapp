/* @flow */

import React from 'react';

import getIcon from '../../../lib/identicon';

import Avatar from '../Avatar';

import type { ColonyType } from '~immutable';

type Props = {|
  address: $PropertyType<ColonyType, 'address'>,
  /** Base64 image */
  avatarData: string,
  name: $PropertyType<ColonyType, 'name'>,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
|};

const ColonyAvatar = ({
  address,
  name,
  avatarData,
  size,
  notSet,
  className,
}: Props) => (
  <Avatar
    avatarURL={avatarData || getIcon(address)}
    className={className}
    notSet={notSet}
    placeholderIcon="at-sign-circle"
    size={size}
    title={name}
  />
);

export default ColonyAvatar;
