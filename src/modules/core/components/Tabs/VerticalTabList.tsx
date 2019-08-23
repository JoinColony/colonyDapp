import React, { HTMLAttributes } from 'react';
import { TabList as ReactTabList } from 'react-tabs';

import styles from './VerticalTabList.css';

const displayName = 'VerticalTabList';
const tabsRole = 'TabList';

const VerticalTabList = ({ ...props }: HTMLAttributes<any>) => (
  <ReactTabList className={styles.main} {...props} />
);

VerticalTabList.tabsRole = tabsRole;

VerticalTabList.displayName = displayName;

export default VerticalTabList;
