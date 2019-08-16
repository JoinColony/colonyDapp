import React, { HTMLAttributes } from 'react';
import { TabPanel as ReactTabPanel } from 'react-tabs';

import styles from './TabPanel.css';

interface Props extends HTMLAttributes<any> {
  /** If set to true the tab will also be rendered if inactive. */
  forceRender?: boolean;

  selectedClassName?: string;
}

const displayName = 'TabPanel';

const TabPanel = (props: Props) => (
  <ReactTabPanel
    className={styles.main}
    selectedClassName={styles.selected}
    {...props}
  />
);

TabPanel.tabsRole = 'TabPanel';

TabPanel.displayName = displayName;

export default TabPanel;
