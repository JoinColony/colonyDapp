/* @flow */

import type { Node } from 'react';

import React from 'react';
import { TabList as ReactTabList } from 'react-tabs';

import styles from './TabList.css';

type Props = {
  /** Node to render into the right of the TabList */
  extra?: Node,
};

const displayName = 'TabList';

const TabList = ({ extra, ...props }: Props) => (
  <div className={styles.container}>
    <ReactTabList className={styles.main} {...props} />
    {extra && <span className={styles.extra}>{extra}</span>}
  </div>
);

TabList.tabsRole = 'TabList';

TabList.displayName = displayName;

export default TabList;
