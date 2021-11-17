import React, { HTMLAttributes } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';
import { useMainClasses } from '~utils/hooks';

import styles from './Tag.css';

export interface Appearance {
  /* "light" is default */
  theme:
    | 'primary'
    | 'light'
    | 'golden'
    | 'danger'
    | 'pink'
    | 'blue'
    | 'dangerGhost'
    | 'banned';
  fontSize?: 'tiny' | 'small';
  /* "fullColor" is default */
  colorSchema?: 'fullColor' | 'inverted' | 'plain';
  margin?: 'none';
}

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** Appearance object */
  appearance?: Appearance;
  /** Text to display in the tag */
  text?: MessageDescriptor | string;
  /** Text values for intl interpolation */
  textValues?: { [key: string]: string };
}

const displayName = 'Tag';

const Tag = ({
  appearance,
  children,
  className,
  text,
  textValues,
  ...rest
}: Props) => {
  const classNames = useMainClasses(appearance, styles, className);
  return (
    <span className={classNames} {...rest}>
      {appearance?.theme === 'banned' && (
        <Icon
          title={text || ''}
          name="emoji-goblin"
          appearance={{ size: 'normal' }}
          className={styles.icon}
        />
      )}
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
    </span>
  );
};

Tag.displayName = displayName;

export default Tag;
