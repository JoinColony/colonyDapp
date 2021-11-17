import React, { HTMLAttributes } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import Icon from '~core/Icon';
import Tag from '~core/Tag';

import styles from './BannedTag.css';

const displayName = 'BannedTag';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
}

const BannedTag = ({
  children,
  text = { id: 'label.banned' },
  textValues,
  ...rest
}: Props) => {
  return (
    <Tag
      className={styles.themeBanned}
      appearance={{ fontSize: 'small', theme: 'pink' }}
      {...rest}
    >
      <Icon
        title={{ id: 'label.banned' }}
        name="emoji-goblin"
        appearance={{ size: 'normal' }}
        className={styles.icon}
      />
      {text ? (
        <>
          {typeof text === 'string' ? (
            text
          ) : (
            <FormattedMessage {...text} values={textValues} />
          )}
        </>
      ) : (
        children
      )}
    </Tag>
  );
};

BannedTag.displayName = displayName;

export default BannedTag;
