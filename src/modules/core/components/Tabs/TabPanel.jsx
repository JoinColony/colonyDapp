/* @flow */

import React from 'react';
import { TabPanel as ReactTabPanel } from 'react-tabs';

import styles from './TabPanel.css';

type Props = {
  /** If set to true the tab will also be rendered if inactive. */
  forceRender?: boolean,
};

const TabPanel = (props: Props) => (
  <ReactTabPanel
    className={styles.main}
    selectedClassName={styles.selected}
    {...props}
  />
);

TabPanel.tabsRole = 'TabPanel';

export default TabPanel;
