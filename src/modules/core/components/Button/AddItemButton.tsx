import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Icon from '../Icon';
import styles from './AddItemButton.css';

interface Props {
  /** A `messageDescriptor` that make up the button's text label */
  text: MessageDescriptor;

  disabled?: boolean;

  handleClick?: () => void;
}

const displayName = 'Button.AddItemButton';

const AddItemButton = ({ text, handleClick, disabled }: Props) => {
  return (
    <button
      className={styles.main}
      onClick={handleClick}
      type="button"
      disabled={disabled}
    >
      <Icon name="circle-plus" title={text} appearance={{ size: 'medium' }} />
      <span>
        <FormattedMessage {...text} />
      </span>
    </button>
  );
};

AddItemButton.displayName = displayName;

export default AddItemButton;
