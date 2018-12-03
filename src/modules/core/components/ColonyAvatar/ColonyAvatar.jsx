/* @flow */
import React from 'react';

import getIcon from '../../../../lib/identicon';

import Avatar from '../Avatar';

import type { ColonyRecord } from '~immutable';

type Props = {
  colony: ColonyRecord,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
};

const ColonyAvatar = ({
  colony: { avatar, address, name },
  ...otherProps
}: Props) => (
  <Avatar
    avatarURL={avatar || getIcon(address)}
    placeholderIcon="at-sign-circle"
    title={name}
    {...otherProps}
  />
);

export default ColonyAvatar;
