import React from 'react';
import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index';

import IconButton from './IconButton';
import styles from './AddItemButton.css';

interface Props {
  /** Name of the icon to display */
  icon?: string;
  /** A string or a `messageDescriptor` that make up the button's text label */
  text: MessageDescriptor;
  /** Values for message descriptors */
  textValues?: SimpleMessageValues;
}

const displayName = 'dashboard.DomainDropdown.AddItemButton';

const AddItemButton = ({ text, icon, textValues }: Props) => {
  return (
    <div className={styles.button}>
      <IconButton icon={icon} text={text} textValues={textValues} />
    </div>
  );
};

AddItemButton.displayName = displayName;

export default AddItemButton;
