import React from 'react';
import { MessageDescriptor } from 'react-intl';

import classnames from 'classnames';
import Button, { Props as DefaultButtonProps } from './Button';
import Icon from '~core/Icon';

import styles from './ThreeDotsButton.css';

const displayName = 'ThreeDotsButton';

interface Props extends DefaultButtonProps {
  activeStyles?: string;
  isOpen: boolean;
  title: MessageDescriptor;
  innerRef?: (ref: HTMLInputElement | null) => void;
}

const ThreeDotsButton = ({
  className,
  isOpen,
  title,
  activeStyles,
  innerRef,
  ...props
}: Props) => {
  const active = activeStyles || styles.menuActive;
  return (
    <Button
      className={classnames(styles.main, className, {
        [active]: isOpen,
      })}
      innerRef={innerRef}
      {...props}
    >
      <Icon className={styles.icon} name="three-dots-row" title={title} />
    </Button>
  );
};

ThreeDotsButton.displayName = displayName;

export default ThreeDotsButton;
