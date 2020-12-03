import React, { ReactNode } from 'react';

import { RouteComponentProps } from '~pages/RouteLayouts';
import UserNavigation from '../UserNavigation';

import styles from './SimpleNav.css';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const SimpleNav = ({ children }: Props) => (
  <div className={styles.wrapper}>
    <div className={styles.nav}>
      <UserNavigation />
    </div>
    {children}
  </div>
);

export default SimpleNav;
