import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';

import styles from './AgreementDialog.css';

const MSG = defineMessages({
  ipfsError: {
    id: `dashboard.Extensions.Whitelist.AgreementDialog.AgreementContainer.ipfsError`,
    defaultMessage: `Failed to retrieve data from IPFS. Please try again.`,
  },
});

interface Props {
  loading: boolean;
  text?: string;
  handleScroll: (e: any) => void;
  containerRef: React.Ref<HTMLDivElement>;
}

const AgreementContainer = ({
  loading,
  text,
  handleScroll,
  containerRef,
}: Props) => {
  return loading ? (
    <SpinnerLoader appearance={{ size: 'huge', theme: 'primary' }} />
  ) : (
    <div
      className={styles.agreementContainer}
      ref={containerRef}
      onScroll={handleScroll}
    >
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
