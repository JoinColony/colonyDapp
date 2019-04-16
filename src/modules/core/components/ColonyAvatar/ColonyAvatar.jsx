/* @flow */

import React from 'react';

import type { Address } from '~types';
import type { ColonyType } from '~immutable';

import Avatar from '~core/Avatar';

export type Props = {|
  /** Address of the colony for identicon fallback */
  colonyAddress: Address,
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
  colonyAddress,
  avatarURL,
  className,
  colony: { displayName: colonyDisplayName, colonyName } = {},
  notSet,
  size,
}: Props) => (
  <Avatar
    avatarURL={avatarURL}
    className={className}
    notSet={notSet}
    placeholderIcon="at-sign-circle"
    seed={colonyAddress}
    size={size}
    title={colonyDisplayName || colonyName || colonyAddress}
  />
);

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
