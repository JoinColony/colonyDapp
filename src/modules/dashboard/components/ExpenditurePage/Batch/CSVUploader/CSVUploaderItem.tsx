import React, { useEffect, SyntheticEvent, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useField } from 'formik';
import { isEmpty } from 'lodash';

import { UploadItemComponentProps } from '~core/FileUpload/types';
import { UploadFile } from '~core/FileUpload';
import { SpinnerLoader } from '~core/Preloaders';
import Button from '~core/Button';

import styles from './CSVUploaderItem.css';

const displayName = `dashboard.ExpenditurePage.Batch.CSVUploader.CSVUploaderItem`;

const MSG = defineMessages({
  removeCSVText: {
    id: `dashboard.ExpenditurePage.Batch.CSVUploader.CSVUploaderItem.removeCSVText`,
    defaultMessage: 'Clear',
  },
  processingText: {
    id: `dashboard.ExpenditurePage.Batch.CSVUploader.CSVUploaderItem.processingText`,
    defaultMessage: 'Processing',
  },
  viewAll: {
    id: `dashboard.ExpenditurePage.Batch.CSVUploader.CSVUploaderItem.viewAll`,
    defaultMessage: 'View all',
  },
});

const CSVUploaderItem = ({
  idx,
  name,
  remove,
  upload,
  processingData,
  handleProcessingData,
}: UploadItemComponentProps) => {
  const [
    ,
    {
      value: { file, uploaded },
      value,
      error,
    },
    { setValue },
  ] = useField<UploadFile>(name);

  const handleRemoveClick = useCallback(
    (evt: SyntheticEvent<HTMLButtonElement>) => {
      evt.stopPropagation();
      upload(null);
      remove(idx);
    },
    [remove, idx, upload],
  );

  useEffect(() => {
    if (file && !error && !uploaded) {
      if (handleProcessingData) {
        handleProcessingData(true);
      }
      upload(value.file);
      setValue({ ...value, uploaded: true });
    }
  }, [file, error, value, handleProcessingData, upload, setValue, uploaded]);

  useEffect(() => {
    if (error && !isEmpty(value.parsedData)) {
      upload(null);
      remove(idx);
    }
  }, [error, idx, remove, upload, value.parsedData]);

  if (processingData || !file) {
    return (
      <div className={styles.loadingSpinnerContainer}>
        <SpinnerLoader
          loadingText={MSG.processingText}
          appearance={{ theme: 'primary', size: 'small', layout: 'horizontal' }}
        />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div>
        <Button
          type="button"
          onClick={handleRemoveClick}
          text={MSG.removeCSVText}
          className={styles.clear}
        />
      </div>
    </div>
  );
};

CSVUploaderItem.displayName = displayName;

export default CSVUploaderItem;
