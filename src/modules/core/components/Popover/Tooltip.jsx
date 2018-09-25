/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import type { ReactRef } from './types';

import Popover from './Popover.jsx';

import styles from './Tooltip.css';

type Placement = 'auto' | 'top' | 'right' | 'bottom' | 'left';

type Props = {
  /** Child element to trigger the popover */
  children: React$Element<*> | (({ ref: ReactRef }) => Node),
  content: Node | MessageDescriptor,
  /** How the popover gets triggered */
  trigger: 'always' | 'hover' | 'click' | 'disabled',
  placement?: Placement,
};

const renderContent = content => (
  <div className={styles.container}>
    {/* $FlowFixMe see renderContent in Popover.jsx */}
    {content}
  </div>
);

const Tooltip = ({ children, content, placement = 'top', trigger }: Props) => (
  <Popover
    appearance={{ theme: 'dark' }}
    trigger={content ? trigger : 'disabled'}
    openDelay={200}
    content={renderContent(content)}
    placement={placement}
  >
    {children}
  </Popover>
);

Tooltip.defaultProps = {
  trigger: 'hover',
};

export default Tooltip;
