import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ExternalLink from '~core/ExternalLink';
import { Step } from '~pages/VerificationPage/types';
import Button from '~core/Button';

import styles from './AboutVerification.css';

const MSG = defineMessages({
  step: {
    id: 'dashboard.VerificationPage.AboutVerification.step',
    defaultMessage: 'Step 1',
  },
  about: {
    id: 'dashboard.VerificationPage.AboutVerification.about',
    defaultMessage: 'About verification',
  },
  description: {
    id: 'dashboard.VerificationPage.AboutVerification.description',
    defaultMessage: `The role of the Protector is to ensure the wishes of the beneficiaries of the Foundation are complied with. <p>All of the following details are required in order to legally register you as a Protector.</p> <a>Data Privacy</a>These details will be securely stored and sent to Korporatio when the payment for incorporation has been approved. This information will not be made public anywhere.`,
  },
  questions: {
    id: 'dashboard.VerificationPage.AboutVerification.about',
    defaultMessage: 'Questions? Contact Korporatio',
  },
  email: {
    id: 'dashboard.VerificationPage.AboutVerification.email',
    defaultMessage: 'Email <a>{email}</a>',
  },
  continue: {
    id: 'dashboard.VerificationPage.AboutVerification.continue',
    defaultMessage: 'Continue',
  },
});

const displayName = 'dashboard.VerificationPage.AboutVerification';

interface Props {
  setActiveStep: React.Dispatch<React.SetStateAction<Step>>;
}

const AboutVerification = ({ setActiveStep }: Props) => {
  return (
    <div>
      <div className={styles.step}>
        <FormattedMessage {...MSG.step} />
      </div>
      <div className={styles.title}>
        <FormattedMessage {...MSG.about} />
      </div>
      <div className={styles.description}>
        <FormattedMessage
          {...MSG.description}
          values={{
            a: (chunks) => (
              <div className={styles.link}>
                <ExternalLink href="/">{chunks}</ExternalLink>
              </div>
            ),
            p: (chunks) => <p className={styles.paragraph}>{chunks}</p>,
          }}
        />
      </div>
      <div className={styles.button}>
        <Button
          onClick={() => setActiveStep(Step.Details)}
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.continue}
        />
      </div>
    </div>
  );
};

AboutVerification.displayName = displayName;

export default AboutVerification;
