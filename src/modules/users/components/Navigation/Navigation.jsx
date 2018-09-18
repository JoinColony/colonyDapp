/* @flow */
import React from 'react';

import Icon from '../../../core/components/Icon';
import Link from '../../../core/components/Link';

import styles from './Navigation.css';

const displayName = 'users.Navigation';

const Navigation = () => (
  <nav className={styles.main}>
    <Link to="/" className={styles.navigationItem}>
      <Icon name="forbidden-signal" title="file" />
    </Link>
    <Link to="/" className={styles.navigationItem}>
      <Icon name="forbidden-signal" title="file" />
    </Link>
    <Link to="/" className={styles.navigationItem}>
      <Icon name="forbidden-signal" title="file" />
    </Link>
  </nav>
);

Navigation.displayName = displayName;

export default Navigation;
