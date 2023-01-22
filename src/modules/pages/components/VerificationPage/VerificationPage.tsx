import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { RouteChildrenProps } from 'react-router';

import ContactSection from '~dashboard/VerificationPage/ContactSection/ContactSection';
import Tabs from '~dashboard/VerificationPage/Tabs';
import AboutVerification from '~dashboard/VerificationPage/AboutVerification';
import Details from '~dashboard/VerificationPage/Details';
import Location from '~dashboard/VerificationPage/Location';
import References from '~dashboard/VerificationPage/References';
import ConfirmationPage from '~dashboard/VerificationPage/ConfirmationPage';

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

type Props = RouteChildrenProps<{ colonyName: string }>;

const VerificationPage = ({ match }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }

  const [formValues, setFormValues] = useState<ContextValuesType>(
    initialFormValues,
  );
  const [activeStep, setActiveStep] = useState<Step>(Step.References);
  // add logic to set form as a submitted after adding sign step
  const [submitted] = useState<boolean>(true);

  const steps: StepObject[] = [
    {
      id: Step.About,
      label: MSG.about,
      validationSchema: undefined,
      component: <AboutVerification setActiveStep={setActiveStep} />,
    },
    {
      id: Step.Details,
      label: MSG.details,
      validationSchema: undefined,
      component: <Details setActiveStep={setActiveStep} />,
    },
    {
      id: Step.Location,
      label: MSG.location,
      validationSchema: undefined,
      component: <Location setActiveStep={setActiveStep} />,
    },
    {
      id: Step.References,
      label: MSG.references,
      validationSchema: undefined,
      component: <References setActiveStep={setActiveStep} />,
    },
  ];

  const activeStepObject = steps.find((step) => step.id === activeStep);

  if (submitted) {
    return <ConfirmationPage />;
  }

  return (
    <VerificationDataContextProvider value={{ formValues, setFormValues }}>
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
    </VerificationDataContextProvider>
  );
};

VerificationPage.displayName = displayName;

export default VerificationPage;
