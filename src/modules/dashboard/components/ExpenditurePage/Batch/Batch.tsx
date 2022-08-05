import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useField } from 'formik';
import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import { Colony } from '~data/index';

import { Batch as BatchType } from './types';
import styles from './Batch.css';
import { SpinnerLoader } from '~core/Preloaders';
import UploadAddressesWidget from '~dashboard/Whitelist/UploadAddressesWidget';
import CSVUploader from './CSVUploader/CSVUploader';

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
  viewAll: {
    id: 'dashboard.ExpenditurePage.Batch.viewAll',
    defaultMessage: 'View all',
  },
});

const displayName = 'dashboard.ExpenditurePage.Batch';

interface Props {
  batch?: BatchType;
  colony: Colony;
}

const Batch = ({ colony }: Props) => {
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const [, { value: batch }] = useField('batch');

  useEffect(() => {
    if (processingCSVData) {
      setOpen(false);
    }
  }, [processingCSVData]);

  return (
    <div className={styles.batchContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.wrapper}>
          <FormattedMessage {...MSG.batch} />
          <Button appearance={{ theme: 'blue' }} type="button">
            {formatMessage(MSG.downloadTemplate)}
          </Button>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.data}>
          <FormattedMessage {...MSG.data} />
          <div>
            {processingCSVData && <SpinnerLoader />}
            {!isOpen && (
              <Button
                appearance={{ theme: 'blue' }}
                type="button"
                onClick={() => setOpen((open) => !open)}
              >
                {formatMessage(MSG.upload)}
              </Button>
            )}
            {batch?.dataCSVUploader?.uploaded && (
              <Button
                appearance={{ theme: 'blue' }}
                type="button"
                onClick={() => {}}
              >
                {formatMessage(MSG.upload)}
              </Button>
            )}
          </div>
        </div>
        <CSVUploader
          name="batch.dataCSVUploader"
          error={undefined}
          processingData={processingCSVData}
          setProcessingData={setProcessingCSVData}
          isOpen={isOpen}
        />
      </FormSection>
      <UploadAddressesWidget colony={colony} />
    </div>
  );
};

Batch.displayName = displayName;

export default Batch;
