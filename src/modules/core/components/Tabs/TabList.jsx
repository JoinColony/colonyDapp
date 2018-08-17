/* @flow */

import React from 'react';
import { TabList as ReactTabList } from 'react-tabs';

import styles from './TabList.css';

type Props = {};

const TabList = (props: Props) => (
  <ReactTabList className={styles.main} {...props} />
);

TabList.tabsRole = 'TabList';

export default TabList;
