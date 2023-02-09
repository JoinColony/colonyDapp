import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ContactSection from '~dashboard/VerificationPage/ContactSection/ContactSection';
import Tabs from '~dashboard/VerificationPage/Tabs';
import Signature from '~dashboard/VerificationPage/Signature';
import Details from '~dashboard/VerificationPage/Details';
import Location from '~dashboard/VerificationPage/Location';
import References from '~dashboard/VerificationPage/References';
import AboutVerification from '~dashboard/VerificationPage/AboutVerification';

import { ContextValuesType, Step, StepObject } from './types';
import { VerificationDataContextProvider } from './VerificationDataContext';
import { initialFormValues } from './constants';
import styles from './VerificationPage.css';

const displayName = 'pages.VerificationPage';

const MSG = defineMessages({
  title: {
    id: 'dashboard.VerificationPage.title',
    defaultMessage: 'Verification process',
  },
  about: {
    id: 'dashboard.VerificationPage.about',
    defaultMessage: 'About verification',
  },
  details: {
    id: 'dashboard.VerificationPage.details',
    defaultMessage: 'Details',
  },
  location: {
    id: 'dashboard.VerificationPage.location',
    defaultMessage: 'Location',
  },
  references: {
    id: 'dashboard.VerificationPage.references',
    defaultMessage: 'References',
  },
  continue: {
    id: 'dashboard.VerificationPage.continue',
    defaultMessage: 'Continue',
  },
  back: {
    id: 'dashboard.VerificationPage.back',
    defaultMessage: 'Back',
  },
});

const VerificationPage = () => {
  const [formValues, setFormValues] = useState<ContextValuesType>(
    initialFormValues,
  );
  const [activeStep, setActiveStep] = useState<Step>(Step.Signature);

  const steps: StepObject[] = [
    {
      id: Step.About,
      label: MSG.about,
      component: <AboutVerification setActiveStep={setActiveStep} />,
    },
    {
      id: Step.Details,
      label: MSG.details,
      component: <Details setActiveStep={setActiveStep} />,
    },
    {
      id: Step.Location,
      label: MSG.location,
      component: <Location setActiveStep={setActiveStep} />,
    },
    {
      id: Step.References,
      label: MSG.references,
      component: <References setActiveStep={setActiveStep} />,
    },
    {
      id: Step.Signature,
      component: <References setActiveStep={setActiveStep} />,
    },
  ];

  const activeStepObject = steps.find((step) => step.id === activeStep);

  return (
    <VerificationDataContextProvider value={{ formValues, setFormValues }}>
      {activeStep === Step.Signature ? (
        <Signature setActiveStep={setActiveStep} />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.formWrapper}>
            <div className={styles.title}>
              <FormattedMessage {...MSG.title} />
            </div>
            <Tabs steps={steps} activeId={activeStep} />
            <div className={styles.contentWrapper}>
              {activeStepObject?.component}
              <ContactSection />
            </div>
          </div>
        </div>
      )}
    </VerificationDataContextProvider>
  );
};

VerificationPage.displayName = displayName;

export default VerificationPage;
