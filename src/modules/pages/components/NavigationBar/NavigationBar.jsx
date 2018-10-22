/* @flow */

import React from 'react';

import HistoryNavigation from './HistoryNavigation.jsx';
import UserNavigation from './UserNavigation.jsx';

import styles from './NavigationBar.css';

const displayName = 'user.NavigationBar';

type Props = {
  appearance: Object,
  children: any,
};

const NavigationBar = ({ children }: Props) => (
  <div className={styles.main}>
    <nav className={styles.navigation}>
      <HistoryNavigation />
      <UserNavigation />
    </nav>
    <main className={styles.content}>{children}</main>
  </div>
);

NavigationBar.displayName = displayName;

export default NavigationBar;
