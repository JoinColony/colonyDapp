import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Form } from '~core/Fields';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';
import LogsSection from '~dashboard/ExpenditurePage/LogsSection';
import TitleDescriptionSection from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';

const displayName = 'pages.ExpenditurePage';

const ExpenditurePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditable, setIsEditable] = useState(true);
  const { colonyName } = useParams<{
    transactionHash?: string;
    colonyName: string;
  }>();

  const { data } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  return isEditable ? (
    <Form onSubmit={() => {}} initialValues={{}}>
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar}>
          <ExpenditureSettings />
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent}>
            <TitleDescriptionSection isEditable />
            <LogsSection
              colonyAddress={data?.colonyAddress || ''}
              isFormEditable={isEditable}
            />
          </main>
        </div>
      </div>
    </Form>
  ) : (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} />
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>
          <TitleDescriptionSection isEditable={isEditable} />
          <LogsSection
            colonyAddress={data?.colonyAddress || ''}
            isFormEditable={isEditable}
          />
        </main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
