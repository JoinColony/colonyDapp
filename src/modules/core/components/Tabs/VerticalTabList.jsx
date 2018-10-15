/* @flow */

import React from 'react';
import { TabList as ReactTabList } from 'react-tabs';

import styles from './VerticalTabList.css';

type Props = {};

const displayName: string = 'VerticalTabList';

const VerticalTabList = ({ ...props }: Props) => (
  <ReactTabList className={styles.main} {...props} />
);

VerticalTabList.tabsRole = displayName;

VerticalTabList.displayName = displayName;

export default VerticalTabList;
