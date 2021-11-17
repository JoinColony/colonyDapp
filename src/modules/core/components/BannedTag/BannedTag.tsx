import React, { HTMLAttributes } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';

import styles from './BannedTag.css';

const displayName = 'BannedTag';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  text?: MessageDescriptor | string;
  textValues?: { [key: string]: string };
}

const BannedTag = ({ children, text, textValues, ...rest }: Props) => {
  return (
    <span className={styles.themeBanned} {...rest}>
      <Icon
        title={{ id: 'label.banned' }}
        name="emoji-goblin"
        appearance={{ size: 'normal' }}
        className={styles.icon}
      />
      <div className={styles.textSyles} {...rest}>
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
      </div>
    </span>
  );
};

BannedTag.displayName = displayName;

export default BannedTag;
