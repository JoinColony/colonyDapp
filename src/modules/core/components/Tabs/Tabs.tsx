import React, { ReactNode } from 'react';
import { Tabs as ReactTabs } from 'react-tabs';

import styles from './Tabs.css';

interface Props {
  className?: string;

  children?: ReactNode;

  /** If set to true the tabs will be focused on initial render */
  defaultFocus?: boolean;

  /** This allows changing the tab that should be open on initial render (only in [uncontrolled mode](https://github.com/reactjs/react-tabs#controlled-vs-uncontrolled-mode)) */
  defaultIndex?: number;

  /** Register a callback that will receive the underlying DOM node for every mount */
  innerRef?: (node: HTMLElement | null) => void;

  /** By default only the current active tab will be rendered to DOM. If set to true all tabs will be rendered to the DOM always. */
  forceRenderTabPanel?: boolean;

  /** This event handler is called every time a tab is about to change. The callback can optionally return true to cancel the change to the new tab */
  onSelect?: (index: number, lastIndex: number, event: Event) => boolean | void;

  /** Set the currently selected tab. This enables controlled mode, which also requires onSelect to be set */
  selectedIndex?: number;
}

const displayName = 'Tabs';

const Tabs = ({ innerRef, ...props }: Props) => (
  <ReactTabs className={styles.main} domRef={innerRef} {...props} />
);

Tabs.displayName = displayName;

export default Tabs;
