import React from 'react';
import {
  MessageDescriptor,
  MessageValues,
  FormattedMessage,
} from 'react-intl';

import Button from './Button';
import Icon from '~core/Icon';

import styles from './IconButton.css';

const displayName = 'IconButton';

interface Props {
  /** Name of the icon to display */
  icon?: string;
  /** A string or a `messageDescriptor` that make up the button's text label */
  text?: MessageDescriptor;
  /** Values for loading text (react-intl interpolation) */
  textValues?: MessageValues;
}

const IconButton = ({
  icon = 'wallet',
  text,
  textValues,
  ...props
}: Props) => (
  <Button {...props}>
    <div className={styles.main}>
      <Icon
        role="button"
          name={icon}
      />
      <FormattedMessage {...text} values={textValues} />
    </div>
  </Button>
);

IconButton.displayName = displayName;

export default IconButton;
