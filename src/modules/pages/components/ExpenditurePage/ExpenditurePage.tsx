import React from 'react';
import CreatorData from '~dashboard/ExpenditurePage/CreatorData';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';

const displayName = 'pages.ExpenditurePage';

const ExpenditurePage = () => {
  return (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar}>
        <CreatorData />
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent} />
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
