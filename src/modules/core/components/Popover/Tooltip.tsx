import React, { ReactNode, useMemo } from 'react';
import { PopperProps } from 'react-popper';

import Popover from './Popover';
import {
  PopoverTriggerType,
  PopoverChildFn,
  PopoverAppearanceType,
} from './types';

import styles from './Tooltip.css';

interface Props {
  /** Appearance object */
  appearance?: PopoverAppearanceType;

  /** Child element to trigger the popover */
  children: ReactNode | PopoverChildFn;

  /** The tooltips' content */
  content: ReactNode;

  /** How the popover gets triggered */
  trigger?: PopoverTriggerType;

  /** The tooltips' placement */
  placement?: PopperProps['placement'];

  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  popperProps?: Omit<PopperProps, 'children'>;

  /** Whether there should be an arrow on the tooltip */
  showArrow?: boolean;

  /** Set the open state from outside */
  isOpen?: boolean;
}

const Tooltip = ({
  appearance = {},
  children,
  content,
  placement = 'top',
  popperProps,
  showArrow = true,
  trigger = 'hover',
  isOpen,
}: Props) => {
  const renderedContent = useMemo(
    () => <div className={styles.container}>{content}</div>,
    [content],
  );
  return (
    <Popover
      appearance={{ theme: 'dark', ...appearance }}
      trigger={content ? trigger : 'disabled'}
      openDelay={200}
      content={renderedContent}
      placement={placement}
      popperProps={popperProps as PopperProps}
      showArrow={showArrow}
      isOpen={isOpen}
    >
      {children}
    </Popover>
  );
};

export default Tooltip;
