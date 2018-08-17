/* @flow */

import React from 'react';
import { TabPanel as ReactTabPanel } from 'react-tabs';

// className: string | Array<string> | { [string]: boolean }
// default: "react-tabs__tab-panel"
// selectedClassName: string
// default: "react-tabs__tab-panel--selected"

type Props = {
  /** If set to true the tab will also be rendered if inactive. */
  forceRender: boolean,
};

const TabPanel = (props: Props) => <ReactTabPanel {...props} />;

TabPanel.tabsRole = 'TabPanel';

export default TabPanel;
