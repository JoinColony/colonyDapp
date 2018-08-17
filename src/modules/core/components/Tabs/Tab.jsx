/* @flow */

import React from 'react';
import { Tab as ReactTab } from 'react-tabs';

// className: string | Array<string> | { [string]: boolean }
// default: "react-tabs__tab"
// disabledClassName: string
// default: "react-tabs__tab--disabled"
// selectedClassName: string
// default: "react-tabs__tab--selected"

type Props = {
  /** Disable this tab which will make it not do anything when clicked. */
  disabled: boolean,
  /** Overrides the tabIndex to enabled tabbing between tabs. */
  tabIndex: string,
};

const Tab = (props: Props) => <ReactTab {...props} />;

Tab.tabsRole = 'Tab';

export default Tab;
