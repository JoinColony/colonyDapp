import React, { HTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';
import Tag from '~core/Tag';

import styles from './BannedTag.css';

const displayName = 'BannedTag';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** Appearance object */
  /** Text to display in the tag */
  text?: MessageDescriptor | string;
  /** Text values for intl interpolation */
}

const BannedTag = ({ text = 'Banned' }: Props) => {
  return (
    <span className={styles.baseStyles}>
      <Tag appearance={{ fontSize: 'small', theme: 'banned', margin: 'none' }}>
        <Icon
          title="banned"
          name="emoji-goblin"
          appearance={{ size: 'extraTiny' }}
          className={styles.icon}
        />
        {text}
      </Tag>
    </span>
  );
};

BannedTag.displayName = displayName;

export default BannedTag;
