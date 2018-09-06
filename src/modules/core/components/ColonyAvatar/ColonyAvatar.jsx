/* @flow */
import React from 'react';

import getIcon from '../../../../lib/identicon';

import Avatar from '../Avatar';

type Props = {
  /** Used for identicon in case of a missing avatarURL */
  colonyAddress: string,
  /** Used for the html title */
  colonyName: string,
  /** Avatar image URL (can be a base64 encoded string) */
  avatarURL?: string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
};

const ColonyAvatar = ({
  avatarURL,
  colonyAddress,
  colonyName,
  ...otherProps
}: Props) => (
  <Avatar
    avatarURL={avatarURL || getIcon(colonyAddress)}
    placeholderIcon="at-sign-circle"
    title={colonyName}
    {...otherProps}
  />
);

export default ColonyAvatar;
