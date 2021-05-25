import React from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import Button from '~core/Button';

import styles from './Warning.css';

interface Props {
  /** A string or a `messageDescriptor` for content text */
  text?: MessageDescriptor | string;

  /** Values for text */
  textValues?: SimpleMessageValues;

  /** A string or a `messageDescriptor` for button content */
  buttonText?: MessageDescriptor | string;

  handleClick?: () => void;

  /** Is button disabled */
  disabled?: boolean;
}

const displayName = 'Warning';

const Warning = ({
  text,
  textValues,
  buttonText,
  handleClick,
  disabled = false,
}: Props) => {
  const { formatMessage } = useIntl();

  const warningText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);

  return (
    <div className={styles.warning}>
      {warningText}
      {buttonText && handleClick && (
        <Button
          appearance={{ theme: 'primary', size: 'medium' }}
          onClick={handleClick}
          text={buttonText}
          disabled={disabled}
        />
      )}
    </div>
  );
};

Warning.displayName = displayName;

export default Warning;
