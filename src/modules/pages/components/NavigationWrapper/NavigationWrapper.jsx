/* @flow */

import React, { cloneElement } from 'react';
import type { Element } from 'react';

import type { MessageDescriptor } from 'react-intl';

import HistoryNavigation from './HistoryNavigation.jsx';
import UserNavigation from './UserNavigation.jsx';

import { getMainClasses } from '~utils/css';

import styles from './NavigationWrapper.css';

const displayName = 'pages.NavigationWrapper';

type Appearance = {
  theme?: 'main' | 'transparent',
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
  backRoute?: string,
  /*
   * If set, it will change the default back link text
   */
  backText?: string | MessageDescriptor,
  /*
   * Works in conjuction with the above to provide message descriptor selector values
   */
  backTextValues?: Object,
  /*
   * Appearance object
   *
   * It's recommended you use this to keep designs standardized
   */
  appearance?: Appearance,
  /*
   * Classname to  the main themes
   *
   * Setting this will  the theme classes
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

const NavigationWrapper = ({
  hasBackLink = true,
  hasUserNavigation = true,
  backRoute,
  backText,
  backTextValues,
  children,
  className,
  appearance = { theme: 'main' },
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
              backRoute={backRoute}
              backText={backText}
              backTextValues={backTextValues}
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

NavigationWrapper.displayName = displayName;

export default NavigationWrapper;
