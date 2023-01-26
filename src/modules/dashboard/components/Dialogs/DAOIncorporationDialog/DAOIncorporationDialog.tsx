import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Dialog, { DialogProps } from '~core/Dialog';
import Button from '~core/Button';

import { CostPanel, HowPanel, WhyPanel } from './TabPanels';
import { Step } from './constants';
import styles from './DAOIncorporationDialog.css';

const displayName = 'dashboard.DAOIncorporationDialog';

const MSG = defineMessages({
  about: {
    id: 'dashboard.DAOIncorporationDialog.about',
    defaultMessage: 'About incorporation',
  },
  why: {
    id: 'dashboard.DAOIncorporationDialog.why',
    defaultMessage: 'Why incorporate your DAO?',
  },
  how: {
    id: 'dashboard.DAOIncorporationDialog.how',
    defaultMessage: 'How it works?',
  },
  cost: {
    id: 'dashboard.DAOIncorporationDialog.how',
    defaultMessage: 'How much does it cost?',
  },
  next: {
    id: 'dashboard.DAOIncorporationDialog.next',
    defaultMessage: 'Next',
  },
  previous: {
    id: 'dashboard.DAOIncorporationDialog.previous',
    defaultMessage: 'Previous',
  },
  incorporate: {
    id: 'dashboard.DAOIncorporationDialog.incorporate',
    defaultMessage: 'Incorporate',
  },
});

export const steps = [
  {
    id: Step.Why,
    title: MSG.why,
    component: <WhyPanel />,
  },
  {
    id: Step.How,
    title: MSG.how,
    component: <HowPanel />,
  },
  {
    id: Step.Cost,
    title: MSG.cost,
    component: <CostPanel />,
  },
];

const DAOIncorporationDialog = ({ cancel }: DialogProps) => {
  const [activeStep, setActiveStep] = useState(Step.Why);

  const onNextClick = useCallback(() => {
    setActiveStep((prevStep) => {
      if (prevStep === Step.Cost) {
        return prevStep;
      }
      const currStepIndex = steps.findIndex((step) => step.id === prevStep);
      return steps[currStepIndex + 1].id;
    });
  }, []);

  const onPrevClick = useCallback(() => {
    setActiveStep((prevStep) => {
      if (prevStep === Step.Why) {
        return prevStep;
      }
      const currStepIndex = steps.findIndex((step) => step.id === prevStep);
      return steps[currStepIndex - 1].id;
    });
  }, []);

  return (
    <div className={styles.dialogWrapper}>
      <Dialog cancel={cancel} widthAuto>
        <div className={styles.wrapper}>
          <div className={styles.sidebar}>
            <div>
              <div className={styles.title}>
                <FormattedMessage {...MSG.about} />
              </div>
              {steps.map((step) => (
                <Button
                  className={classNames(styles.tab, {
                    [styles.textActive]: activeStep === step.id,
                  })}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div
                    className={classNames(styles.marker, {
                      [styles.active]: activeStep === step.id,
                    })}
                  />
                  <FormattedMessage {...step.title} />
                </Button>
              ))}
              <div />
            </div>
            <div>
              <hr className={styles.divider} />
              <div className={styles.buttonsWrapper}>
                {activeStep !== Step.Why && (
                  <Button
                    className={styles.buttonPrevious}
                    onClick={onPrevClick}
                  >
                    <FormattedMessage {...MSG.previous} />
                  </Button>
                )}
                <Button onClick={onNextClick}>
                  <FormattedMessage
                    {...(activeStep === Step.Cost ? MSG.incorporate : MSG.next)}
                  />
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            {steps.find((step) => step.id === activeStep)?.component}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DAOIncorporationDialog;

DAOIncorporationDialog.displayName = displayName;
