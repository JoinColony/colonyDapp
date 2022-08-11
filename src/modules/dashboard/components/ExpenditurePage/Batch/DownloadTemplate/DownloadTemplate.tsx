import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ExternalLink from '~core/ExternalLink';

import styles from './DownloadTemplate.css';

export const MSG = defineMessages({
  linkText: {
    id: 'dashboard.ExpenditurePage.Batch.DownloadTemplate.linkText',
    defaultMessage: 'Download template',
  },
});

const DownloadTemplate = () => {
  const fileDownloadUrl = useMemo(() => {
    const CSV = ['"Recipient","Token","Amount"', '"","",""'].join('\n');
    const blob = new Blob([CSV]);
    return URL.createObjectURL(blob);
  }, []);

  return (
    <ExternalLink
      href={fileDownloadUrl}
      download="template.csv"
      className={styles.link}
    >
      <FormattedMessage {...MSG.linkText} />
    </ExternalLink>
  );
};

DownloadTemplate.displayName =
  'dashboard.ExpenditurePage.Batch.DownloadTemplate';

export default DownloadTemplate;
