/* @flow */

import React from 'react';

import type { ColonyType } from '~immutable';

import Avatar from '~core/Avatar';

export type Props = {|
  /** Address of the current user for identicon fallback */
  address: string,
  /** Avatar image URL (can be a base64 encoded url string) */
  avatarURL?: string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /** The corresponding user object if available */
  colony?: ColonyType,
|};

const displayName = 'ColonyAvatar';

const ColonyAvatar = ({
  address,
  avatarURL,
  className,
  colony: { displayName: colonyDisplayName, ensName } = {},
  notSet,
  size,
}: Props) => (
  <Avatar
    avatarURL={avatarURL}
    className={className}
    notSet={notSet}
    placeholderIcon="at-sign-circle"
    seed={address}
    size={size}
    title={colonyDisplayName || ensName || address}
  />
);

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
