import React, { ReactNode } from 'react';
import { PopperProps } from 'react-popper';

import Popover from './Popover';
import { PopoverTriggerType, PopoverChildFn } from './types';

import styles from './Tooltip.css';

interface Props {
  /** Child element to trigger the popover */
  children: ReactNode | PopoverChildFn;

  /** The tooltips' content */
  content: ReactNode;

  /** How the popover gets triggered */
  trigger: PopoverTriggerType;

  /** The tooltips' placement */
  placement?: PopperProps['placement'];

  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  popperProps?: Omit<PopperProps, 'children'>;

  /** Whether there should be an arrow on the tooltip */
  showArrow: boolean;

  /** Set the open state from outside */
  isOpen?: boolean;

  darkTheme?: boolean;
}

const renderContent = content => (
  <div className={styles.container}>{content}</div>
);

const Tooltip = ({
  children,
  content,
  placement = 'top',
  popperProps,
  showArrow,
  trigger,
  isOpen,
  darkTheme = true,
}: Props) => (
  <Popover
    appearance={darkTheme ? { theme: 'dark' } : undefined}
    trigger={content ? trigger : 'disabled'}
    openDelay={200}
    content={renderContent(content)}
    placement={placement}
    popperProps={popperProps as PopperProps}
    showArrow={showArrow}
    isOpen={isOpen}
  >
    {children}
  </Popover>
);

Tooltip.defaultProps = {
  trigger: 'hover',
  showArrow: true,
};

export default Tooltip;
