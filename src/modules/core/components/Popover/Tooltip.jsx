/* @flow */

import type { Node } from 'react';

import React from 'react';

import type { PopoverPlacementType, ReactRef } from './types';

import Popover from './Popover.jsx';

import styles from './Tooltip.css';

type Props = {|
  /** Child element to trigger the popover */
  children: React$Element<*> | (({ ref: ReactRef }) => Node),
  /** The tooltips' content */
  content: Node,
  /** How the popover gets triggered */
  trigger: 'hover' | 'click' | 'disabled',
  /** The tooltips' placement */
  placement?: PopoverPlacementType,
  /** Options to pass through the <Popper> element. See here: https://github.com/FezVrasta/react-popper#api-documentation */
  popperProps?: Object,
  /** Whether there should be an arrow on the tooltip */
  showArrow: boolean,
  /** Set the open state from outside */
  isOpen?: boolean,
  darkTheme?: boolean,
|};

const renderContent = content => (
  <div className={styles.container}>
    {/* $FlowFixMe see renderContent in Popover.jsx */}
    {content}
  </div>
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
    popperProps={popperProps}
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
