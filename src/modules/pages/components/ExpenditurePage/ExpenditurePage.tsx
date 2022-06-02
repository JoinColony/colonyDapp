import React, { useCallback } from 'react';
import * as yup from 'yup';

import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/consts';

const displayName = 'pages.ExpenditurePage';

const initialValues = {
  expenditure: 'advanced',
  recipients: [newRecipient],
};

const validationSchema = yup.object().shape({
  expenditure: yup.string().required(),
  recipients: yup.array(
    yup.object().shape({
      recipient: yup.object().required('User is required'),
      value: yup
        .array(
          yup.object().shape({
            amount: yup.number().required(),
            tokenAddress: yup.string().required(),
          }),
        )
        .min(1),
      delay: yup
        .object()
        .shape({
          amount: yup.string().required(),
          time: yup.string().required('Delay is required'),
        })
        .required(),
    }),
  ),
});

const ExpenditurePage = () => {
  const submit = useCallback((values) => {
    // eslint-disable-next-line no-console
    console.log({ values });
  }, []);

  return (
    <Form
      initialValues={initialValues}
      onSubmit={submit}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
    >
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar}>
          <ExpenditureSettings />
          <Payments />
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent} />
        </div>
      </div>
    </Form>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
