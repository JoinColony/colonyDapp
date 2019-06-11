/* @flow */

import React from 'react';
import type { Node as ReactNode } from 'react';

import type { TokenReferenceType } from '~immutable';

import Avatar from '~core/Avatar';

import styles from './TokenIcon.css';

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
  /** Some token icons can where imported
  manually ( without sprite-loader )
  and will be shown directly */
  component?: ReactNode,
|};

const displayName = 'TokenIcon';

const TokenIcon = ({
  token,
  iconURL,
  className,
  name,
  size,
  component,
}: Props) => {
  console.log(component);
  const { address } = token;
  return component ? (
    <div className={styles.svg}>{component()}</div>
  ) : (
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
