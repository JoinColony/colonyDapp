import React from 'react';
import { defineMessage } from 'react-intl';

import { useWhitelistAgreementQuery } from '~data/index';

import { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';

import { AgreementContainer } from '../AgreementDialog';

import styles from './AgreementEmbed.css';

const MSG = defineMessage({
  title: {
    id: 'dashboard.Extensions.Whitelist.AgreementEmbed.title',
    defaultMessage: 'Sale agreement',
  },
});

interface Props {
  agreementHash: string;
}

const AgreementEmbed = ({ agreementHash }: Props) => {
  const { data, loading } = useWhitelistAgreementQuery({
    variables: { agreementHash },
    fetchPolicy: 'network-only',
  });

  return (
    <div className={styles.container}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      <DialogSection>
        <AgreementContainer text={data?.whitelistAgreement} loading={loading} />
      </DialogSection>
    </div>
  );
};

AgreementEmbed.displayName = 'dashboard.Whitelist.AgreementEmbed';

export default AgreementEmbed;
