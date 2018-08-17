/* @flow */
import React from 'react';
import type { Node } from 'react';

import styles from './ActivityBar.css';

type Props = {
  children: Node,
};

const ActivityBarComponent = ({ children }: Props) => (
  <div className={styles.component}>{children}</div>
);

export default ActivityBarComponent;
