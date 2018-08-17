/* @flow */

import React from 'react';
import { Tab as ReactTab } from 'react-tabs';

import styles from './Tab.css';

type Props = {
  /** Disable this tab which will make it not do anything when clicked. */
  disabled?: boolean,
  /** Overrides the tabIndex to enabled tabbing between tabs. */
  tabIndex?: string,
};

const Tab = (props: Props) => (
  <ReactTab
    className={styles.main}
    selectedClassName={styles.selected}
    disabledClassName={styles.disabled}
    {...props}
  />
);

Tab.tabsRole = 'Tab';

export default Tab;
