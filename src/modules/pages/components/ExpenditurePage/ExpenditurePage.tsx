import React from 'react';
import Payments from '~dashboard/ExpenditurePage/Payments';
import TopParameters from '~dashboard/ExpenditurePage/TopParameters';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';

const displayName = 'pages.ExpenditurePage';

const ExpenditurePage = () => {
  return (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar}>
        <TopParameters />
        <Payments />
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent} />
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
