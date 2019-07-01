/* @flow */

import React from 'react';

import getIcon from '../../../../lib/identicon';
import Icon from '../Icon';

import styles from './Avatar.css';

type Props = {|
  /** Seed phrase for blockies fallback (usually an address) */
  seed: string,
  /** Avatar image URL (can be a base64 encoded string) */
  avatarURL?: string,
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
|};

const displayName = 'Avatar';

const Avatar = ({
  seed,
  avatarURL,
  className,
  notSet,
  placeholderIcon,
  size,
  title,
}: Props) => {
  const avatar = notSet ? null : avatarURL || getIcon(seed);
  // if using a blockie, do pixelated image scaling
  const imageRendering = avatarURL ? undefined : 'pixelated';
  const imageStyle = avatar
    ? { backgroundImage: `url(${avatar})`, imageRendering }
    : {};
  const mainClass = size ? styles[size] : styles.main;
  return (
    <figure
      className={className ? `${mainClass} ${className}` : mainClass}
      title={title}
    >
      {avatar ? (
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
