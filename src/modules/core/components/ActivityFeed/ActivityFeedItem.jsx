/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './ActivityFeedItem.css';

type Props = {
  children: Node,
};

const ActivityFeedItem = ({ children }: Props) => (
  <li className={styles.main}>{children}</li>
);

export default ActivityFeedItem;
