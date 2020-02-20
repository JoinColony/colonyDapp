import React, { Component, ReactElement, ReactNode } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import { Tab, Tabs, VerticalTabList, TabPanel } from '~core/Tabs';

import styles from './VerticalNavigation.css';

export interface NavigationItem {
  /*
   * Used as a unique key when mapping over the elements. Must be set!
   */
  id: number;

  /*
   * Name for the tab entry.
   * Can be anything: message descriptor, string, or even a ReactElement
   */
  title: MessageDescriptor | string | ReactElement<any>;

  /*
   * Content to render in the tab panel
   */
  content: ReactNode;
}

interface State {
  tabIndex: number;
}

interface Props {
  /*
   * Array of `NavigationItem` object to render into vertical tab format
   * Without this nothing will render
   */
  navigationItems?: NavigationItem[];

  /*
   * Extra children components to render
   * @NOTE That this will render before the tab list
   */
  children?: ReactNode;

  /*
   * Index of tab that should be open initially
   */
  initialTab: number;
}

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
            onSelect={newIndex => {
              this.setTabIndex(newIndex);
            }}
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
                  {title instanceof Object &&
                  (title as MessageDescriptor).id ? (
                    <FormattedMessage {...(title as MessageDescriptor)} />
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
