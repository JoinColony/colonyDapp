import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ExternalLink from '~core/ExternalLink';

import styles from './ContactSection.css';

const MSG = defineMessages({
  questions: {
    id: 'dashboard.VerificationPage.ContactSection.about',
    defaultMessage: 'Questions? Contact Korporatio',
  },
  email: {
    id: 'dashboard.VerificationPage.ContactSection.email',
    defaultMessage: 'Email <a>{email}</a>',
  },
});

const displayName = 'dashboard.VerificationPage.ContactSection';

const ContactSection = () => {
  return (
    <div className={styles.rightColumn}>
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
  );
};

ContactSection.displayName = displayName;

export default ContactSection;
