/* @flow */

import React from 'react';
import { TabList as ReactTabList } from 'react-tabs';

// className: string | Array<string> | { [string]: boolean }
// default: "react-tabs__tab-list"

type Props = {};

const TabList = (props: Props) => <ReactTabList {...props} />;

TabList.tabsRole = 'TabList';

export default TabList;
