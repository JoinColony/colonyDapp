import React, { useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import Button from '~core/Button';
import CSVUploader from '~core/CSVUploader';
import { FormSection } from '~core/Fields';

import { Colony } from '~data/index';

import styles from './Batch.css';
import DownloadTemplate from './DownloadTemplate/DownloadTemplate';
import { Batch as BatchType } from './types';

export const MSG = defineMessages({
  batch: {
    id: 'dashboard.ExpenditurePage.Batch.batch.',
    defaultMessage: 'Batch',
  },
  data: {
    id: 'dashboard.ExpenditurePage.Batch.data.',
    defaultMessage: 'Data (max. 400)',
  },
  downloadTemplate: {
    id: 'dashboard.ExpenditurePage.Batch.downloadTemplate',
    defaultMessage: 'Download template',
  },
  upload: {
    id: 'dashboard.ExpenditurePage.Batch.upload',
    defaultMessage: 'Upload .CSV',
  },
  hide: {
    id: 'dashboard.ExpenditurePage.Batch.hide',
    defaultMessage: 'Hide',
  },
});

const displayName = 'dashboard.ExpenditurePage.Batch';

interface Props {
  batch: BatchType;
  colony: Colony;
}

const Batch = () => {
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { formatMessage } = useIntl();

  return (
    <div className={styles.batchContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.wrapper}>
          <FormattedMessage {...MSG.batch} />
          <DownloadTemplate />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.data}>
          <FormattedMessage {...MSG.data} />
          <Button
            appearance={{ theme: 'blue' }}
            type="button"
            onClick={() => setOpen((open) => !open)}
          >
            {formatMessage(isOpen ? MSG.hide : MSG.upload)}
          </Button>
        </div>
        {isOpen && (
          <CSVUploader
            name="whitelistCSVUploader"
            error={undefined}
            processingData={processingCSVData}
            setProcessingData={setProcessingCSVData}
          />
        )}
      </FormSection>
    </div>
  );
};

Batch.displayName = displayName;

export default Batch;
