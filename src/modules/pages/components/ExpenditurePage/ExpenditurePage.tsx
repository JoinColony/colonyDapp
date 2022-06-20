import React, { useCallback, useRef, useState } from 'react';
import * as yup from 'yup';

import { Form } from '~core/Fields';
import Payments from '~dashboard/ExpenditurePage/Payments';
import ExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings';
import Stages from '~dashboard/ExpenditurePage/Stages';
import { getMainClasses } from '~utils/css';
import styles from './ExpenditurePage.css';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/consts';
import LockedExpenditureSettings from '~dashboard/ExpenditurePage/ExpenditureSettings/LockedExpenditureSettings';
import LockedPayments from '~dashboard/ExpenditurePage/Payments/LockedPayments';
import TitleDescriptionSection, {
  LockedTitleDescriptionSection,
} from '~dashboard/ExpenditurePage/TitleDescriptionSection';
import { Stage } from '~dashboard/ExpenditurePage/Stages/constants';

const displayName = 'pages.ExpenditurePage';

const initialValues = {
  expenditure: 'advanced',
  filteredDomainId: undefined,
  owner: undefined,
  recipients: [newRecipient],
  title: undefined,
  description: undefined,
};

export interface ValuesType {
  expenditure: string;
  filteredDomainId: { label: string; value: string };
  owner: string;
  recipients: {
    recipient: string;
    value: { amount: number; tokenAddress: number }[];
    delay: { amount: string; time: string };
    isExpanded: boolean;
  }[];
  title: string;
  description?: string;
}

export type InitialValuesType = typeof initialValues;

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
  const [isFormEditable, setFormEditable] = useState(true);
  const [formValues, setFormValues] = useState<ValuesType>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const [activeStateId, setActiveStateId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleSubmit = useCallback((values) => {
    setShouldValidate(true);
    setActiveStateId(Stage.Draft);

    if (values) {
      setFormValues(values);
    }
    // add sending form values to backend
  }, []);

  const lockValues = useCallback(() => {
    setFormEditable(false);
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
      onSubmit={handleSubmit}
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
            <Stages
              {...{ activeStateId, setActiveStateId, lockValues, handleSubmit }}
            />
          </main>
        </div>
      </div>
    </Form>
  ) : (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar} ref={sidebarRef}>
        <LockedExpenditureSettings
          {...{ expenditure, team: filteredDomainId }}
          owner={owner as any}
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
          <Stages
            {...{ activeStateId, setActiveStateId, lockValues, handleSubmit }}
          />
        </main>
      </div>
    </div>
  );
};

ExpenditurePage.displayName = displayName;

export default ExpenditurePage;
