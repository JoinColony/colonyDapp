import React from 'react';
import { MessageDescriptor } from 'react-intl';

import Button, { Props as DefaultButtonProps } from './Button';
import Icon from '~core/Icon';

import styles from './ThreeDotsButton.css';

const displayName = 'ThreeDotsButton';

interface Props extends DefaultButtonProps {
  icon?: string;
  title: MessageDescriptor;
  innerRef?: (ref: HTMLInputElement | null) => void;
}

const ThreeDotsButton = ({
  icon = 'three-dots-row',
  title,
  innerRef,
  ...props
}: Props) => (
  <Button innerRef={innerRef} {...props}>
    <Icon className={styles.icon} name={icon} title={title} />
  </Button>
);

ThreeDotsButton.displayName = displayName;

export default ThreeDotsButton;
