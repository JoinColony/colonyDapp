import React, { useCallback, useRef, useState } from 'react';
import * as yup from 'yup';

import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditurePage.css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/consts';
import LockedExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings/LockedExpenditureSettings';
import LockedPayments from '~dashboard/ExpenditurePage/Payments/LockedPayments';
import TitleDescriptionSection, {
  LockedTitleDescriptionSection,
} from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import Button from '~core/Button';

const displayName = 'pages.ExpenditurePage';

const initialValues = {
  expenditure: 'advanced',
  filteredDomainId: undefined,
  owner: undefined,
  recipients: [newRecipient],
  title: undefined,
  description: undefined,
};

const validationSchema = yup.object().shape({
  expenditure: yup.string().required(),
  filteredDomainId: yup.string().required('Team is required'),
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
  title: yup.string().required(),
});

const ExpenditurePage = () => {
  const [isFormEditable, setFormEditable] = useState(false);
  const [formValues, setFormValues] = useState<typeof initialValues>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const submit = useCallback((values) => {
    setShouldValidate(true);
    if (values) {
      setFormValues(values);
    }
    setFormEditable(false);
    // add sending form to backend
  }, []);

  const { owner, expenditure, filteredDomainId } = formValues || {};

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  return isFormEditable ? (
    <Form
      initialValues={formValues || initialValues}
      onSubmit={submit}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
    >
      <div className={getMainClasses({}, styles)}>
        <aside className={styles.sidebar} ref={sidebarRef}>
          <ExpenditureSettings />
          <Payments sidebarRef={sidebarRef.current} />
        </aside>
        <div className={styles.mainContainer}>
          <main className={styles.mainContent}>
            <TitleDescriptionSection />
            {/* Button is temporary. It should be removed when PR with expenditure locking is merged */}
            <Button type="submit" style={{ marginLeft: '25px' }}>
              Lock values
            </Button>
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
        <LockedPayments
          recipients={formValues?.recipients}
          editForm={() => setFormEditable(true)}
        />
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent}>
          <LockedTitleDescriptionSection
            title={formValues?.title}
            description={formValues?.description}
          />
        </main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
