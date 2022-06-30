import React from 'react';

import { Colony } from '~data/index';

import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';

import styles from './ColonyHomeLayout.css';

const displayName = 'dashboard.ColonyHome.ColonyHomeInfo';

interface Props {
  colony: Colony;
  isMobile: boolean;
  showNavigation: boolean;
}

const ColonyHomeInfo = ({ colony, isMobile, showNavigation }: Props) => (
  <aside className={styles.leftAside}>
    <ColonyTitle colony={colony} />
    {!isMobile && showNavigation && <ColonyNavigation colony={colony} />}
  </aside>
);

ColonyHomeInfo.displayName = displayName;

export default ColonyHomeInfo;
