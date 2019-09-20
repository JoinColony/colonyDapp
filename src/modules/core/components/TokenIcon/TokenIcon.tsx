import React, { ReactNode } from 'react';

import {
  ColonyTokenReferenceType,
  UserTokenReferenceType,
} from '~immutable/index';
import Avatar from '~core/Avatar';
import styles from './TokenIcon.css';

export interface Props {
  /** Token reference to display */
  token: ColonyTokenReferenceType | UserTokenReferenceType;

  /** Icon image URL (can be a base64 encoded url string) */
  iconURL?: string;

  /** Is passed through to Avatar */
  className?: string;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** Optional name for the icon title */
  name?: string;

  /** Some token icons can be imported
  manually ( without sprite-loader )
  and will be shown directly, if that is the case
  showing the avatar will be omitted
  */
  children?: ReactNode;
}

const displayName = 'TokenIcon';

const TokenIcon = ({
  token,
  iconURL,
  className,
  name,
  size,
  children,
}: Props) => {
  const { address } = token;
  return children ? (
    <div className={styles.svg}>{children}</div>
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
