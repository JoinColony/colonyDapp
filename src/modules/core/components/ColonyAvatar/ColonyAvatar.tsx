import React from 'react';

import { Address } from '~types/index';
import { AnyColony } from '~data/index';

import Avatar from '~core/Avatar';
import NavLink from '~core/NavLink';

export interface Props {
  /** Address of the colony for identicon fallback */
  colonyAddress: Address;

  /** Avatar image URL (can be a base64 encoded url string) */
  avatarURL?: string;

  /** Is passed through to Avatar */
  className?: string;

  /** Avatars that are not set have a different placeholder */
  notSet?: boolean;

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** The corresponding user object if available */
  colony?: AnyColony;
}

const displayName = 'ColonyAvatar';

const ColonyAvatar = ({
  colonyAddress,
  avatarURL,
  className,
  // @ts-ignore
  colony: { displayName: colonyDisplayName, colonyName } = {},
  notSet,
  size,
  showLink,
}: Props) => {
  const colonyAvatar = (
    <Avatar
      avatarURL={avatarURL}
      className={className}
      notSet={notSet}
      placeholderIcon="at-sign-circle"
      seed={colonyAddress && colonyAddress.toLowerCase()}
      size={size}
      title={colonyDisplayName || colonyName || colonyAddress}
    />
  );
  if (showLink && colonyName) {
    return <NavLink to={`/colony/${colonyName}`}>{colonyAvatar}</NavLink>;
  }
  return colonyAvatar;
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
