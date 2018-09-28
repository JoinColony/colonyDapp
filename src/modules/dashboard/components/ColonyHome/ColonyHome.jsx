/* @flow */

import React, { Fragment } from 'react';

import styles from './ColonyHome.css';

const displayName: string = 'dashboard.ColonyHome';

const ColonyHome = () => (
  <div className={styles.main}>
    <Fragment>Colony Home</Fragment>
  </div>
);

ColonyHome.displayName = displayName;

export default ColonyHome;
