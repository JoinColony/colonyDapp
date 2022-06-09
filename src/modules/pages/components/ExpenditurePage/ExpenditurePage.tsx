import React, { useCallback, useEffect, useRef, useState } from 'react';
// import * as yup from 'yup';

import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/consts';
// import LockedPayments from '~dashboard/ExpenditurePage/Payments/LockedPayments';
import LockedExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings/LockedExpenditureSettings';
// import { recipients } from './consts';

const displayName = 'pages.ExpenditurePage';

const initialValues = {
  expenditure: 'advanced',
  filteredDomainId: undefined,
  owner: undefined,
  recipients: [newRecipient],
};

// const validationSchema = yup.object().shape({
// expenditure: yup.string().required(),
// recipients: yup.array(
//   yup.object().shape({
//     recipient: yup.object().required('User is required'),
//     value: yup
//       .array(
//         yup.object().shape({
//           amount: yup.number().required(),
//           tokenAddress: yup.string().required(),
//         }),
//       )
//       .min(1),
//     delay: yup
//       .object()
//       .shape({
//         amount: yup.string().required(),
//         time: yup.string().required('Delay is required'),
//       })
//       .required(),
//   }),
// ),
// });

const ExpenditurePage = () => {
  const [isFormEditable, setFormEditable] = useState(true);
  const [formValues, setFormValues] = useState<typeof initialValues>();
  const sidebarRef = useRef<HTMLElement>(null);
  const submit = useCallback((values) => {
    // eslint-disable-next-line no-console
    setFormValues(values);
    // eslint-disable-next-line no-console
    console.log({ values });
    // setFormEditable(false);
  }, []);

  useEffect(() => {
    if (formValues === undefined) {
      return;
    }
    setFormEditable(false);
  }, [formValues]);

  const { owner, expenditure, filteredDomainId } = formValues || {};

  return isFormEditable ? (
    <Form
      initialValues={initialValues}
      onSubmit={submit}
      // validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
    >
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar} ref={sidebarRef}>
          <ExpenditureSettings />
          <Payments sidebarRef={sidebarRef.current} />
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent}>
            <button type="submit">submit</button>
          </main>
        </div>
      </div>
    </Form>
  ) : (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} ref={sidebarRef}>
        <LockedExpenditureSettings
          {...{ owner, expenditure, team: filteredDomainId }}
        />
        {/* <LockedPayments recipients={recipients} /> */}
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent} />
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
