import React from 'react';

import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';

import styles from './ColonyHomeLayout.css';

const displayName = 'dashboard.ColonyHome.ColonyHomeInfo';

const ColonyHomeInfo = ({ colony, isMobile, showNavigation }) => (
  <aside className={styles.leftAside}>
    <ColonyTitle colony={colony} />
    {!isMobile && showNavigation && <ColonyNavigation colony={colony} />}
  </aside>
);

ColonyHomeInfo.displayName = displayName;

export default ColonyHomeInfo;
