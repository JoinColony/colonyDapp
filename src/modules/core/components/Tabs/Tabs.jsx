/* @flow */

import React from 'react';
import { Tabs as ReactTabs } from 'react-tabs';

// className: string | Array<string> | { [string]: boolean }
// default: "react-tabs"

type Props = {
  /** If set to true the tabs will be focused on initial render */
  defaultFocus: boolean,
  /** This allows changing the tab that should be open on initial render (only in [uncontrolled mode](https://github.com/reactjs/react-tabs#controlled-vs-uncontrolled-mode)) */
  defaultIndex: number,
  /** Register a callback that will receive the underlying DOM node for every mount */
  // domRef: (node: ?HTMLElement) => void
  innerRef: (node: ?HTMLElement) => void,
  /** By default only the current active tab will be rendered to DOM. If set to true all tabs will be rendered to the DOM always. */
  forceRenderTabPanel: boolean,
  /** This event handler is called every time a tab is about to change. The callback can optionally return true to cancel the change to the new tab */
  onSelect: (index: number, lastIndex: number, event: Event) => ?boolean,
  /** Set the currently selected tab. This enables controlled mode, which also requires onSelect to be set */
  selectedIndex: number,
};

// TODO: defaults

const Tabs = (props: Props) => <ReactTabs {...props} />;

export default Tabs;
