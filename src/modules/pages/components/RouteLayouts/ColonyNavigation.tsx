import React from 'react';

import UserNavigation from './UserNavigation';

import { RouteComponentProps } from './index';

import styles from './ColonyNavigation.css';
import HistoryNavigation from './HistoryNavigation';

interface Props {
  routeProps?: RouteComponentProps;
}

const displayName = 'pages.RouteLayouts.ColonyNavigation';

const ColonyNavigation = ({ routeProps = {} }: Props) => (
  <div className={styles.main}>
    <div>
      {routeProps.hasBackLink !== false && (
        <div className={styles.backLinkContainer}>
          <HistoryNavigation
            backRoute={routeProps.backRoute}
            backText={routeProps.backText}
            backTextValues={routeProps.backTextValues}
          />
        </div>
      )}
    </div>
    <div>
      <UserNavigation />
    </div>
  </div>
);

ColonyNavigation.displayName = displayName;

export default ColonyNavigation;
