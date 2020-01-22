import React, { HTMLAttributes } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import { useMainClasses } from '~utils/hooks';

import styles from './Badge.css';

interface Appearance {
  theme: 'primary' | 'light';
}

interface Props extends HTMLAttributes<HTMLSpanElement> {
  appearance?: Appearance;
  text?: MessageDescriptor | string;
  textValues?: { [key: string]: string };
}

const displayName = 'Badge';

const Badge = ({
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

Badge.displayName = displayName;

export default Badge;
