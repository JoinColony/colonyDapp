/* @flow */

import React, { cloneElement } from 'react';
import type { Element } from 'react';

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
   * Appearance object for theme-ing (see above)
   */
  appearance?: Appearance,
  /*
   * Classname to overwrite the theme object
   */
  className?: string,
  /*
   * Childrent to render in the main section
   */
  children?: Element<*>,
};

const NavigationBar = ({
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
        <div className={styles.history}>
          <HistoryNavigation />
        </div>
        <div className={styles.user}>
          <UserNavigation />
        </div>
      </nav>
      <main className={styles.content}>
        {children && cloneElement(children, { ...props })}
      </main>
    </div>
  </div>
);

NavigationBar.displayName = displayName;

export default NavigationBar;
