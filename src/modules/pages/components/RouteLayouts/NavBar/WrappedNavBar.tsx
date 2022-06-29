import React from 'react';

import NavBar, { Props } from './NavBar';
import styles from './WrappedNavBar.css';

const WrappedNavBar = ({ routeProps, children }: Props) => {
  return (
    <div className={styles.container}>
      <NavBar {...{ routeProps, children }} />
    </div>
  );
};

export default WrappedNavBar;
