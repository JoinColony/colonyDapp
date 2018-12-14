/* @flow */

import React from 'react';

import Icon from '../Icon';

import styles from './Avatar.css';

type Props = {
  /** Avatar image URL (can be a base64 encoded string) */
  avatarURL?: ?string,
  /** Extra className */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Icon name to use for placeholder */
  placeholderIcon: string,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /** Title for a11y */
  title: string,
};

const displayName = 'Avatar';

const Avatar = ({
  avatarURL,
  className,
  notSet,
  placeholderIcon,
  size,
  title,
}: Props) => {
  const imageStyle = avatarURL ? { backgroundImage: `url(${avatarURL})` } : {};
  const mainClass = size ? styles[size] : styles.main;
  return (
    <figure
      className={className ? `${mainClass} ${className}` : mainClass}
      title={title}
    >
      {avatarURL ? (
        <div className={styles.image} style={imageStyle} />
      ) : (
        <Icon
          className={
            notSet ? styles.placeholderIconNotSet : styles.placeholderIcon
          }
          name={placeholderIcon}
          title={title}
        />
      )}
    </figure>
  );
};

Avatar.displayName = displayName;

export default Avatar;
