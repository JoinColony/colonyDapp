import React, { ReactNode } from 'react';

import styles from './OverviewList.css';

interface Props {
  children: ReactNode;
}

const displayName = 'core.OverviewList';

const OverviewList = ({ children }: Props) => (
  <div>
    <ul className={styles.list}>{children}</ul>
  </div>
);

OverviewList.displayName = displayName;

export default OverviewList;
