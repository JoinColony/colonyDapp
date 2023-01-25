import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Formik } from 'formik';

import { Input } from '~core/Fields';
import { Step } from '~pages/VerificationPage/types';
import { useVerificationContext } from '~pages/VerificationPage/VerificationDataContext';
import IconTooltip from '~core/IconTooltip';

import FormButtons from '../FormButtons';

import styles from './References.css';

export const MSG = defineMessages({
  step: {
    id: 'dashboard.VerificationPage.References.step',
    defaultMessage: 'Step 4',
  },
  references: {
    id: 'dashboard.VerificationPage.References.references',
    defaultMessage: '<div>References</div> {icon}',
  },
  bankingReference: {
    id: 'dashboard.VerificationPage.References.bankingReference',
    defaultMessage: 'Banking reference: <span>(required)</span>',
  },
  bankingReferenceAdditional: {
    id: 'dashboard.VerificationPage.References.bankingReferenceAdditional',
    defaultMessage: `Name and contact details of bank of which you maintain a current banking relation. This may be used for managing fraud risk.`,
  },
  nameOfBank: {
    id: 'dashboard.VerificationPage.References.nameOfBank',
    defaultMessage: 'Name of the bank',
  },
  contactDetails: {
    id: 'dashboard.VerificationPage.References.contactDetails',
    defaultMessage: `Contact details (email/phone) of the bank`,
  },
  commercialReference: {
    id: 'dashboard.VerificationPage.References.commercialReference',
    defaultMessage: 'Commercial reference: <span>(required)</span>',
  },
  commercialReferenceAdditional: {
    id: 'dashboard.VerificationPage.References.commercialReferenceAdditional',
    defaultMessage: `Name and contact details of a person or business with whom you maintain a business relation. Example your accountant or lawyer.`,
  },
  nameOfBusiness: {
    id: 'dashboard.VerificationPage.References.nameOfBusiness',
    defaultMessage: 'Name of the business or contact',
  },
  commercialContactDetails: {
    id: 'dashboard.VerificationPage.References.contactDetails',
    defaultMessage: `Contact details (email -or- phone)`,
  },
});

const displayName = 'dashboard.VerificationPage.References';

interface Props {
  setActiveStep: React.Dispatch<React.SetStateAction<Step>>;
}

const References = ({ setActiveStep }: Props) => {
  const {
    formValues: { references },
    setFormValues,
  } = useVerificationContext();

  const handleSubmit = useCallback(
    (values) => {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        references: values,
      }));
    },
    [setFormValues],
  );

  const handlePrevClick = useCallback(
    (values) => {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        references: values,
      }));
      setActiveStep(Step.Location);
    },
    [setActiveStep, setFormValues],
  );

  return (
    <Formik initialValues={references} onSubmit={handleSubmit}>
      {({ values }) => (
        <div className={styles.wrapper}>
          <div className={styles.step}>
            <FormattedMessage {...MSG.step} />
          </div>
          <div className={styles.title}>
            <FormattedMessage
              {...MSG.references}
              values={{
                icon: (
                  <IconTooltip
                    icon="question-mark"
                    tooltipText={{ id: 'tooltip.lockedToken' }}
                    appearance={{ size: 'huge' }}
                  />
                ),
                div: (chunks) => (
                  <div className={styles.titleText}>{chunks}</div>
                ),
              }}
            />
          </div>
          <div className={styles.wrapper}>
            <div className={styles.groupTitle}>
              <FormattedMessage
                {...MSG.bankingReference}
                values={{
                  span: (chunks) => (
                    <span className={styles.required}>{chunks}</span>
                  ),
                }}
              />
            </div>
            <div className={styles.subtitle}>
              <FormattedMessage {...MSG.bankingReferenceAdditional} />
            </div>

            <div className={styles.fieldWrapper}>
              <Input label={MSG.nameOfBank} name="bankName" />
            </div>
            <div className={styles.fieldWrapper}>
              <Input label={MSG.contactDetails} name="contactDetails" />
            </div>
          </div>
          <div className={styles.commercialWrapper}>
            <div className={styles.groupTitle}>
              <FormattedMessage
                {...MSG.commercialReference}
                values={{
                  span: (chunks) => (
                    <span className={styles.required}>{chunks}</span>
                  ),
                }}
              />
            </div>
            <div className={styles.subtitle}>
              <FormattedMessage {...MSG.commercialReferenceAdditional} />
            </div>
            <div className={styles.fieldWrapper}>
              <Input label={MSG.nameOfBusiness} name="businessName" />
            </div>
            <div className={styles.fieldWrapper}>
              <Input
                label={MSG.commercialContactDetails}
                name="commercianContactDetails"
              />
            </div>
          </div>
          <FormButtons onPrevClick={() => handlePrevClick(values)} />
        </div>
      )}
    </Formik>
  );
};

References.displayName = displayName;

export default References;
