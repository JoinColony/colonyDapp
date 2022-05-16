import React from 'react';
import Recipient from '~dashboard/ExpenditurePage/Recipient';
import TopParameters from '~dashboard/ExpenditurePage/TopParameters';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';

const displayName = 'pages.ExpenditurePage';

const ExpenditurePage = () => {
  return (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar}>
        <TopParameters />
        <Recipient />
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent} />
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
