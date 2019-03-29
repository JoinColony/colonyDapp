/* @flow */

import React from 'react';

import getIcon from '../../../../lib/identicon';

import Avatar from '../Avatar';

import type { ColonyType } from '~immutable';

type Props = {|
  /** Address of the current user for identicon fallback */
  address: string,
  /** Avatar image URL (can be a base64 encoded string) */
  avatar?: string,
  /** Is passed through to Avatar */
  className?: string,
  /** Colony object */
  colony: ColonyType,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
|};

const ColonyAvatar = ({
  address,
  colony: { name },
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
    title={name}
  />
);

export default ColonyAvatar;
