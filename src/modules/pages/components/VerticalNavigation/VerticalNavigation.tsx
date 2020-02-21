import React, { ReactElement, ReactNode, useState } from 'react';
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

const displayName = 'pages.VerticalNavigation';

const VerticalNavigation = ({
  children,
  initialTab = 0,
  navigationItems,
}: Props) => {
  const [tabIndex, setTabIndex] = useState<number>(initialTab);

  return (
    <div className={styles.main}>
      {navigationItems && navigationItems.length && (
        <Tabs
          className={styles.tabs}
          selectedIndex={tabIndex}
          onSelect={newIndex => {
            setTabIndex(newIndex);
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
                {title instanceof Object && (title as MessageDescriptor).id ? (
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
};

VerticalNavigation.displayName = displayName;

export default VerticalNavigation;
