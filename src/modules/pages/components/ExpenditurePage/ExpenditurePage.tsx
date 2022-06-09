import React from 'react';
import { Form } from '~core/Fields';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';
import Stages from '~dashboard/ExpenditurePage/Stages';
import TitleDescriptionSection from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';

const displayName = 'pages.ExpenditurePage';

const ExpenditurePage = () => {
  return (
    <Form onSubmit={() => {}} initialValues={{}}>
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar}>
          <ExpenditureSettings />
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent}>
            <TitleDescriptionSection isEditable />
            <Stages />
          </main>
        </div>
      </div>
    </Form>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
