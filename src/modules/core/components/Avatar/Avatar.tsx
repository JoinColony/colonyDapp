import React, { CSSProperties, ReactNode } from 'react';

import getIcon from '../../../../lib/identicon';
import Icon from '../Icon';
import styles from './Avatar.css';

export interface Props {
  /** Seed phrase for blockies fallback (usually an address) */
  seed?: string;

  /** Avatar image URL (can be a base64 encoded string) */
  avatarURL?: string;

  /** If children are present, they will be rendered directly (for svg components) */
  children?: ReactNode;

  /** Extra className */
  className?: string;

  /** Avatars that are not set have a different placeholder */
  notSet?: boolean;

  /** Icon name to use for placeholder */
  placeholderIcon: string;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** Title for a11y */
  title: string;
}

const displayName = 'Avatar';

const Avatar = ({
  seed,
  avatarURL,
  children,
  className,
  notSet,
  placeholderIcon,
  size,
  title,
}: Props) => {
  const fallback = getIcon(seed || title);
  const avatar = notSet ? null : avatarURL || fallback;
  const mainClass = size ? styles[size] : styles.main;
  if (children) {
    return (
      <figure
        className={className ? `${mainClass} ${className}` : mainClass}
        title={title}
      >
        {children}
      </figure>
    );
  }

  const imageStyle: CSSProperties = avatar
    ? {
        // if using a blockie, do pixelated image scaling
        imageRendering: avatarURL ? undefined : 'pixelated',
      }
    : {};
  return (
    <figure
      className={className ? `${mainClass} ${className}` : mainClass}
      title={title}
    >
      {avatar ? (
        <img
          src={avatar}
          className={styles.image}
          style={imageStyle}
          onError={(e) => {
            // @NOTE: We do this just in case the browser fails to retrieve the avatar
            e.currentTarget.src = fallback;
            e.currentTarget.style.imageRendering = 'pixelated';
          }}
          alt=""
        />
      ) : (
        <Icon
          className={
            notSet ? styles.placeholderIconNotSet : styles.placeholderIcon
          }
          name={placeholderIcon}
          title={title}
          data-test="avatar"
        />
      )}
    </figure>
  );
};

Avatar.displayName = displayName;

export default Avatar;
