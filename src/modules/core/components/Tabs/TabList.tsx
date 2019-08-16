import React, { HTMLAttributes, ReactNode } from 'react';
import { TabList as ReactTabList } from 'react-tabs';

import styles from './TabList.css';

interface Props extends HTMLAttributes<any> {
  /** ReactNode to render into the right of the TabList */
  extra?: ReactNode;
}

const displayName = 'TabList';

const TabList = ({ extra, ...props }: Props) => (
  <div className={styles.container}>
    <ReactTabList className={styles.main} {...props} />
    {extra && <span>{extra}</span>}
  </div>
);

TabList.tabsRole = 'TabList';

TabList.displayName = displayName;

export default TabList;
