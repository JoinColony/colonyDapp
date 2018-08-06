/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import type { ReactRef } from './types';

import Popover from './Popover.jsx';

import styles from './Tooltip.css';

type Placement =
  | 'auto'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'right-start'
  | 'top-start'
  | 'left-start'
  | 'top-end'
  | 'right-end'
  | 'top-end'
  | 'left-end';

type Props = {
  /** Child element to trigger the popover */
  children: React$Element<*> | (({ ref: ReactRef }) => Node),
  content: string | MessageDescriptor,
  placement: Placement,
};

const renderContent = content => (
  <div className={styles.container}>
    {/* $FlowFixMe see renderContent in Popover.jsx */}
    {content}
  </div>
);

const Tooltip = ({ children, content, placement }: Props) => (
  <Popover
    appearance={{ theme: 'dark' }}
    trigger="hover"
    openDelay={200}
    content={renderContent(content)}
    placement={placement}
  >
    {children}
  </Popover>
);

export default Tooltip;
