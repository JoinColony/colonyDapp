import React, { useCallback } from 'react';
import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';

const displayName = 'pages.ExpenditurePage';

const initialValues = {
  recipients: [
    {
      id: '0',
      recipient: undefined,
      value: [
        {
          id: '0',
          amount: undefined,
          tokenAdress: undefined,
        },
      ],
      delay: undefined,
      isExpanded: true,
    },
  ],
};

const ExpenditurePage = () => {
  const submit = useCallback((values) => {
    // eslint-disable-next-line no-console
    console.log({ values });
  }, []);

  return (
    <Form initialValues={initialValues} onSubmit={submit}>
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar}>
          <ExpenditureSettings />
          <Payments />
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent}>
            <button type="submit">Submit</button>
          </main>
        </div>
      </div>
    </Form>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
