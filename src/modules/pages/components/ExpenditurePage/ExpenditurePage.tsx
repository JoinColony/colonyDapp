import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';

interface Props {
  children: ReactNode;
}

const displayName = 'pages.ExpenditurePage';

const ExpenditurePage = ({ children }: Props) => {
  return (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} />
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
