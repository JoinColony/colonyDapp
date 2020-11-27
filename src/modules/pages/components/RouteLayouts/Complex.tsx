import React, { ReactNode } from 'react';

import { RouteComponentProps } from '~pages/RouteLayouts';
import SubscribedColoniesList from '~dashboard/SubscribedColoniesList';
import SimpleNav from './SimpleNav';

import styles from './Complex.css';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const displayName = 'pages.Complex';

const Complex = ({ children }: Props) => (
  <SimpleNav>
    <div className={styles.main}>
      <div className={styles.coloniesList}>
        <SubscribedColoniesList />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  </SimpleNav>
);

Complex.displayName = displayName;

export default Complex;
