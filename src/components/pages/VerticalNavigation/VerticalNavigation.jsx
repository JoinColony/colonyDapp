/* @flow */

import React, { Component } from 'react';
import type { Element, Node } from 'react';
import { FormattedMessage } from 'react-intl';

import { Tab, Tabs, VerticalTabList, TabPanel } from '~components/core/Tabs';

import type { MessageDescriptor } from 'react-intl';

import styles from './VerticalNavigation.css';

export type NavigationItem = {
  /*
   * Used as a unique key when mapping over the elements. Must be set!
   */
  id: number,
  /*
   * Name for the tab entry.
   * Can be anything: message descriptor, string, or even an React Element
   */
  title: MessageDescriptor | string | Element<*>,
  /*
   * Content to render in the tab panel
   */
  content: Node,
};

type State = {
  tabIndex: number,
};

type Props = {|
  /*
   * Array of `NavigationItem` object to render into vertical tab format
   * Without this nothing will render
   */
  navigationItems?: Array<NavigationItem>,
  /*
   * Extra children components to render
   * @NOTE That this will render before the tab list
   */
  children?: Node,
  /*
   * Index of tab that should be open initially
   */
  initialTab?: number,
|};

class VerticalNavigation extends Component<Props, State> {
  static displayName = 'pages.VerticalNavigation';

  static defaultProps = { initialTab: 0 };

  state = {
    tabIndex: 0,
  };

  componentWillMount() {
    /**
     * If there's a selectedTab prop set it otherwise
     * handle tab setting like normal
     */
    const { initialTab } = this.props;
    this.setState({
      tabIndex: initialTab,
    });
  }

  setTabIndex = (tabIndex: number) => {
    this.setState({ tabIndex });
  };

  render() {
    const { navigationItems, children } = this.props;
    const { tabIndex } = this.state;
    return (
      <div className={styles.main}>
        {navigationItems && navigationItems.length && (
          <Tabs
            className={styles.tabs}
            selectedIndex={tabIndex}
            onSelect={newIndex => this.setTabIndex(newIndex)}
          >
            <VerticalTabList className={styles.tabList}>
              {children}
              {navigationItems.map(({ title, id }) => (
                <Tab
                  key={id}
                  className={styles.tab}
                  selectedClassName={styles.tabSelected}
                  disabledClassName={styles.tabDisabled}
                >
                  {title instanceof Object && title.id ? (
                    <FormattedMessage {...title} />
                  ) : (
                    title
                  )}
                </Tab>
              ))}
            </VerticalTabList>
            {navigationItems.map(({ content, id }) => (
              <TabPanel key={id} className={styles.tabPanel}>
                <div className={styles.contentWrapper}>{content}</div>
              </TabPanel>
            ))}
          </Tabs>
        )}
      </div>
    );
  }
}

export default VerticalNavigation;
