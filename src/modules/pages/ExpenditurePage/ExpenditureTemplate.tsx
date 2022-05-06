import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditureTemplate.css';

interface Props {
  children: ReactNode;
}

const displayName = 'pages.ExpenditureTemplate';

const ExpenditureTemplate = ({ children }: Props) => {
  return (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} />
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

ExpenditureTemplate.displayName = displayName;

export default ExpenditureTemplate;
