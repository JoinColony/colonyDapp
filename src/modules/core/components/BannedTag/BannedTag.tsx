import React, { HTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';
import Tag from '~core/Tag';

import styles from './BannedTag.css';

const displayName = 'BannedTag';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  text?: MessageDescriptor | string;
}

const BannedTag = ({ text = 'Banned' }: Props) => {
  return (
    <Tag appearance={{ fontSize: 'small', theme: 'banned', margin: 'none' }}>
      <Icon
        title="banned"
        name="emoji-goblin"
        appearance={{ size: 'normal' }}
        className={styles.icon}
      />
      <div className={styles.textSyles}>{text}</div>
    </Tag>
  );
};

BannedTag.displayName = displayName;

export default BannedTag;
