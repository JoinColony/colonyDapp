/* @flow */

import React from 'react';
import type { Element, Node } from 'react';
import nanoid from 'nanoid';
import { FormattedMessage } from 'react-intl';
import { TabList as ReactTabList } from 'react-tabs';

import { Tab, Tabs, TabPanel } from '~core/Tabs';

import type { MessageDescriptor } from 'react-intl';

import styles from './VerticalNavigation.css';

type NavigationItem = {
  /*
   * Name for the tab entry.
   * Can be anything: message descriptor, string, or even an React Element
   */
  name: MessageDescriptor | string | Element<*>,
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

const displayName = 'VerticalNavigation';

const VerticalNavigation = ({ navigationItems, children }: Props) => (
  <div className={styles.main}>
    {navigationItems &&
      navigationItems.length && (
        <Tabs className={styles.tabs}>
          {/*
            * We're using the original `ReactTabList` component instead of our
            * `TabList` to not have to brutally modify it and complicate it with
            * extra, one-off props. (We would need to remove all the container
            * styles just to get rid of the border)
            */}
          <ReactTabList className={styles.tabList}>
            {children}
            {navigationItems.map(({ name }, index) => (
              <Tab
                key={nanoid(index)}
                className={styles.tab}
                selectedClassName={styles.tabSelected}
                disabledClassName={styles.tabDisabled}
              >
                {name instanceof Object && name.id ? (
                  <FormattedMessage {...name} />
                ) : (
                  name
                )}
              </Tab>
            ))}
          </ReactTabList>
          {navigationItems.map(({ content }, index) => (
            <TabPanel key={nanoid(index)} className={styles.tabPanel}>
              {content}
            </TabPanel>
          ))}
        </Tabs>
      )}
  </div>
);

VerticalNavigation.displayName = displayName;

export default VerticalNavigation;
