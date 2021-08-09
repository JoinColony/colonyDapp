import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';

import styles from './AgreementDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.WhitelisExtension.AgreementDialog.title',
    defaultMessage: 'Sale agreement',
  },
  signedButton: {
    id: 'dashboard.Extensions.WhitelisExtension.AgreementDialog.gotItButton',
    defaultMessage: 'Signed',
  },
  ipfsError: {
    id: 'dashboard.Extensions.WhitelisExtension.AgreementDialog.ipfsError',
    defaultMessage: `There is a problem loading the agreement. Please, try again or contact colony admins.`,
  },
});

interface Props {
  loading: boolean;
  text?: string;
}

const AgreementContainer = ({ loading, text }: Props) => {
  return loading ? (
    <SpinnerLoader appearance={{ size: 'huge', theme: 'primary' }} />
  ) : (
    <div className={styles.agreementContainer}>
      {text || (
        <div className={styles.error}>
          <FormattedMessage {...MSG.ipfsError} />
        </div>
      )}
    </div>
  );
};

AgreementContainer.displayName =
  'dashboard.Whitelist.AgreementDialog.AgreementContainer';

export default AgreementContainer;
