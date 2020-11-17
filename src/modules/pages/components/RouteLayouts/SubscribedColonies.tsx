import React, { ReactNode } from 'react';

import SubscribedColoniesList from '~dashboard/SubscribedColoniesList/SubscribedColoniesList';

import { RouteComponentProps } from '.';
import ColonyNavigation from './ColonyNavigation';

import styles from './SubscribedColonies.css';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const displayName = 'pages.RouteLayouts.SubscribedColonies';

const SubscribedColonies = ({ children, routeProps }: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.colonyList}>
        <SubscribedColoniesList />
      </div>
      <div>
        <div className={styles.navContainer}>
          <ColonyNavigation routeProps={routeProps} />
        </div>
        {children}
      </div>
    </div>
  );
};

SubscribedColonies.displayName = displayName;

export default SubscribedColonies;
