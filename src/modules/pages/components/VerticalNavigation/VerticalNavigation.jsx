/* @flow */

import React from 'react';
import type { Element, Node } from 'react';
import nanoid from 'nanoid';
import { FormattedMessage } from 'react-intl';

import { Tab, Tabs, VerticalTabList, TabPanel } from '~core/Tabs';

import type { MessageDescriptor } from 'react-intl';

import styles from './VerticalNavigation.css';

export type NavigationItem = {
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

type Props = {
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
};

const displayName = 'pages.VerticalNavigation';

const VerticalNavigation = ({ navigationItems, children }: Props) => (
  <div className={styles.main}>
    {navigationItems &&
      navigationItems.length && (
        <Tabs className={styles.tabs}>
          <VerticalTabList className={styles.tabList}>
            {children}
            {navigationItems.map(({ title }, index) => (
              <Tab
                key={nanoid(index)}
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
          {navigationItems.map(({ content }, index) => (
            <TabPanel key={nanoid(index)} className={styles.tabPanel}>
              <div className={styles.contentWrapper}>{content}</div>
            </TabPanel>
          ))}
        </Tabs>
      )}
  </div>
);

VerticalNavigation.displayName = displayName;

export default VerticalNavigation;
