/* @flow */

import React from 'react';

import type { TokenReferenceType } from '~immutable';

import Avatar from '~core/Avatar';

export type Props = {|
  /** Token reference to display */
  token: TokenReferenceType,
  /** Icon image URL (can be a base64 encoded url string) */
  iconURL?: string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /** Optional name for the icon title */
  name?: string,
|};

const displayName = 'TokenIcon';

const TokenIcon = ({ token, iconURL, className, name, size }: Props) => {
  const { address } = token;
  return (
    <Avatar
      avatarURL={iconURL}
      className={className}
      placeholderIcon="circle-close"
      seed={address}
      size={size}
      title={name || address}
    />
  );
};

TokenIcon.displayName = displayName;

export default TokenIcon;
