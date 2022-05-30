import React from 'react';
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
  const { colonyName } = useParams<{
    transactionHash?: string;
    colonyName: string;
  }>();

  const { data } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  return (
    <Form onSubmit={() => {}} initialValues={{}}>
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar}>
          <ExpenditureSettings />
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent}>
            <TitleDescriptionSection isEditable />
            <LogsSection colonyAddress={data?.colonyAddress || ''} />
          </main>
        </div>
      </div>
    </Form>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
