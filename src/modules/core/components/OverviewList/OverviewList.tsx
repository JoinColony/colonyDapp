import React, { ReactNode } from 'react';

import styles from './OverviewList.css';

interface Props {
  children: ReactNode;
}

const OverviewList = ({ children }: Props) => (
  <div>
    <ul className={styles.list}>{children}</ul>
  </div>
);

export default OverviewList;
