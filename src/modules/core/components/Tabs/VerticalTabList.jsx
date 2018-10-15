/* @flow */

import React from 'react';
import { TabList as ReactTabList } from 'react-tabs';

import styles from './VerticalTabList.css';

type Props = {};

/*
 * @NOTE This is breaking convention and might get confusing
 *
 * But if we don't name the component `TabList`, `react-tabs` won't detect it and will
 * break it's functionality (because it goes by name and not by rendered component)
 */
const displayName: string = 'TabList';

const VerticalTabList = ({ ...props }: Props) => (
  <ReactTabList className={styles.main} {...props} />
);

VerticalTabList.tabsRole = displayName;

VerticalTabList.displayName = displayName;

export default VerticalTabList;
