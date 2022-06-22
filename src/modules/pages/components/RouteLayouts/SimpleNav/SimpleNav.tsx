import React, { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

import { RouteComponentProps } from '~pages/RouteLayouts';
import UserNavigation from '../UserNavigation';

import { query700 as query } from '~styles/queries.css';

import styles from './SimpleNav.css';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const SimpleNav = ({ children }: Props) => {
  const isMobile = useMediaQuery({ query });

  // Render UserNavigation in parent component (Default) on mobile.
  return (
    <div className={styles.wrapper}>
      {!isMobile && (
        <div className={styles.nav}>
          <UserNavigation />
        </div>
      )}
      {children}
    </div>
  );
};

export default SimpleNav;
