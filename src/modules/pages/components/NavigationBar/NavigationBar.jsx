/* @flow */

import React, { cloneElement } from 'react';
import type { Element } from 'react';

import type { MessageDescriptor } from 'react-intl';

import HistoryNavigation from './HistoryNavigation.jsx';
import UserNavigation from './UserNavigation.jsx';

import { getMainClasses } from '~utils/css';

import styles from './NavigationBar.css';

const displayName = 'pages.NavigationBar';

type Appearance = {
  theme?: 'gray' | 'transparent',
};

type Props = {
  /*
   * If disabled, the navigation bar won't render the back link
   */
  hasBackLink?: boolean,
  /*
   * If disabled, the navigation bar won't render the user navigation
   */
  hasUserNavigation?: boolean,
  /*
   * If set, the the back link will redirect back to a specific route
   */
  overwriteBackRoute?: string,
  /*
   * If set, it will change the default back link text
   */
  overwriteBackText?: string | MessageDescriptor,
  /*
   * Works in conjuction with the above to provide message descriptor selector values
   */
  overwriteBackTextValues?: Object,
  /*
   * Apperance object
   *
   * It's recommended you use this to keep designs standardized
   */
  appearance?: Appearance,
  /*
   * Classname to overwrite the main themes
   *
   * Seting this will overwrite the theme classes
   */
  className?: string,
  /*
   * Children to render in the main section.
   *
   * Seeing as this is basically a wrapper for most components,
   * this should always have a value
   */
  children: Element<*>,
};

const NavigationBar = ({
  hasBackLink = true,
  hasUserNavigation = true,
  overwriteBackRoute,
  overwriteBackText,
  overwriteBackTextValues,
  children,
  className,
  appearance = { theme: 'gray' },
  /*
   * All the remaining props are passed down to the the children
   */
  ...props
}: Props) => (
  <div className={className || getMainClasses(appearance, styles)}>
    <div className={styles.wrapper}>
      <nav className={styles.navigation}>
        {hasBackLink && (
          <div className={styles.history}>
            <HistoryNavigation
              overwriteBackRoute={overwriteBackRoute}
              overwriteBackText={overwriteBackText}
              overwriteBackTextValues={overwriteBackTextValues}
            />
          </div>
        )}
        {hasUserNavigation && (
          <div className={styles.user}>
            <UserNavigation />
          </div>
        )}
      </nav>
      <main className={styles.content}>
        {children && cloneElement(children, { ...props })}
      </main>
    </div>
  </div>
);

NavigationBar.displayName = displayName;

export default NavigationBar;
