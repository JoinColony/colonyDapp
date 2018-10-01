/* @flow */

import React from 'react';

import styles from './ColonyHome.css';

const displayName: string = 'dashboard.ColonyHome';

const ColonyHome = () => (
  <div className={styles.main}>
    <aside className={styles.colonyInfo}>Colony Info</aside>
    <main className={styles.content}>Main Content</main>
    <aside className={styles.sidebar}>Sidebar</aside>
  </div>
);

ColonyHome.displayName = displayName;

export default ColonyHome;
