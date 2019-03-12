/* @flow */

import type { MessageDescriptor } from 'react-intl';

// $FlowFixMe (not possible until we upgrade flow to 0.87)
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from './Button.jsx';

import styles from './ConfirmButton.css';

const displayName = 'ConfirmButton';

type Props = {
  onConfirmToggled?: (state: boolean) => any,
  onClick: () => any,
  text?: MessageDescriptor | string,
  confirmText?: MessageDescriptor,
};

const ConfirmButton = ({
  onConfirmToggled,
  onClick,
  text,
  confirmText,
  ...rest
}: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const toggleConfirmState = () => {
    if (onConfirmToggled) onConfirmToggled(!showConfirm);
    setShowConfirm(!showConfirm);
  };
  const handleSubmit = async () => {
    toggleConfirmState();
    onClick();
  };
  if (showConfirm) {
    return (
      <span className={styles.confirmContainer}>
        <span className={styles.confirmText}>
          {confirmText && <FormattedMessage {...confirmText} />}
        </span>
        <Button
          text={{ id: 'button.yes' }}
          appearance={{ theme: 'blue' }}
          onClick={handleSubmit}
        />
        <span className={styles.separator}>/</span>
        <Button
          text={{ id: 'button.no' }}
          appearance={{ theme: 'blue' }}
          onClick={toggleConfirmState}
        />
      </span>
    );
  }
  return <Button text={text} onClick={toggleConfirmState} {...rest} />;
};

ConfirmButton.displayName = displayName;

export default ConfirmButton;
