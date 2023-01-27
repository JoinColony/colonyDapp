import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ExternalLink from '~core/ExternalLink';
import Link from '~core/Link';

import styles from './ConfirmationPage.css';

const MSG = defineMessages({
  submitted: {
    id: 'dashboard.VerificationPage.ConfirmationPage.submitted',
    defaultMessage: 'Verification submitted!',
  },
  description: {
    id: 'dashboard.VerificationPage.ConfirmationPage.submitted',
    defaultMessage: `Look out for an email from Korporatio. The verification process can take a few days to process.`,
  },
  buttonText: {
    id: 'dashboard.VerificationPage.ConfirmationPage.buttonText',
    defaultMessage: 'Got it, take me back',
  },
  questions: {
    id: 'dashboard.VerificationPage.ConfirmationPage.about',
    defaultMessage: 'Questions? Contact Korporatio directly',
  },
  email: {
    id: 'dashboard.VerificationPage.ConfirmationPage.email',
    defaultMessage: 'Email <a>{email}</a>',
  },
});

const displayName = 'dashboard.VerificationPage.ConfirmationPage';

const ConfirmationPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.infoWrapper}>
        <div className={styles.header}>
          <FormattedMessage {...MSG.submitted} />
        </div>
        <div className={styles.description}>
          <FormattedMessage {...MSG.description} />
        </div>
        <div className={styles.contactInfo}>
          <FormattedMessage {...MSG.questions} />
          <div className={styles.emailTab}>
            <FormattedMessage
              {...MSG.email}
              values={{
                a: (chunks) => (
                  <>
                    <ExternalLink href="mailto:future@korporatio.com">
                      {chunks}
                    </ExternalLink>
                  </>
                ),
                email: 'future@korporatio.com',
              }}
            />
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <Link to="/" className={styles.buttonLink} text={MSG.buttonText} />
        </div>
      </div>
    </div>
  );
};

ConfirmationPage.displayName = displayName;

export default ConfirmationPage;
