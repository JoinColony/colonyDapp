import React, { useEffect, SyntheticEvent } from 'react';
import { defineMessages } from 'react-intl';
import { useField } from 'formik';

import { UploadItemComponentProps } from '~core/FileUpload/types';
import { UploadFile } from '~core/FileUpload';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './CSVUploaderItem.css';

import Button from '~core/Button';

const displayName = 'dashboard.Whitelist.CSVUploader.CSVUploaderItem';

const MSG = defineMessages({
  removeCSVText: {
    id: 'dashboard.Whitelist.CSVUploader.CSVUploaderItem.removeCSVText',
    defaultMessage: 'Remove',
  },
  processingText: {
    id: 'dashboard.Whitelist.CSVUploader.CSVUploaderItem.processingText',
    defaultMessage: 'Processing',
  },
});

const CSVUploaderItem = ({
  error,
  idx,
  name,
  remove,
  upload,
  handleError,
  processingData,
  handleProcessingData,
}: UploadItemComponentProps) => {
  const [
    ,
    {
      value: { file },
      value,
    },
  ] = useField<UploadFile>(name);

  const handleRemoveClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    remove(idx);
  };

  useEffect(() => {
    if (file && !error) {
      if (handleProcessingData) {
        handleProcessingData(true);
      }
      upload(value.file);
    }

    if (error && handleError) {
      handleError();
    }
  }, [file, error]);

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
      <span className={styles.fileName}>{file.name}</span>
      <div>
        <Button
          type="button"
          onClick={handleRemoveClick}
          appearance={{ theme: 'blue' }}
          text={MSG.removeCSVText}
        />
      </div>
    </div>
  );
};

CSVUploaderItem.displayName = displayName;

export default CSVUploaderItem;
