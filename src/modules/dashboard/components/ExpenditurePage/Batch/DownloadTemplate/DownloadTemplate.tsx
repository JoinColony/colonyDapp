import React, { useMemo } from 'react';

import ExternalLink from '~core/ExternalLink';

// import styles from './DownloadTemplate.css';

const DownloadTemplate = () => {
  const fileDownloadUrl = useMemo(() => {
    const template = ['Recipient', 'Token', 'Amount'];

    const blob = new Blob(template);
    return URL.createObjectURL(blob);
  }, []);

  return (
    <ExternalLink
      href={fileDownloadUrl}
      download="template.csv"
      // className={styles.link}
    >
      Download template
    </ExternalLink>
  );
};

DownloadTemplate.displayName =
  'dashboard.ExpenditurePage.Batch.DownloadTemplate';

export default DownloadTemplate;
