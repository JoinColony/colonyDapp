/* @flow */

import React from 'react';
import { TabList as ReactTabList } from 'react-tabs';

import styles from './VerticalTabList.css';

type Props = {};

const displayName: string = 'VerticalTabList';
const tabsRole: string = 'TabList';

const VerticalTabList = ({ ...props }: Props) => (
  <ReactTabList className={styles.main} {...props} />
);

VerticalTabList.tabsRole = tabsRole;

VerticalTabList.displayName = displayName;

export default VerticalTabList;
