import React, { useEffect, SyntheticEvent, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useField } from 'formik';

import { UploadItemComponentProps } from '~core/FileUpload/types';
import { UploadFile } from '~core/FileUpload';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './CSVUploaderItem.css';

import Button from '~core/Button';

const displayName = 'core.CSVUploader.CSVUploaderItem';

const MSG = defineMessages({
  removeCSVText: {
    id: 'core.CSVUploader.CSVUploaderItem.removeCSVText',
    defaultMessage: 'Remove',
  },
  processingText: {
    id: 'core.CSVUploader.CSVUploaderItem.processingText',
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
      value: { file, uploaded },
      value,
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

    if (error && handleError) {
      handleError();
    }
  }, [
    file,
    error,
    value,
    handleProcessingData,
    handleError,
    upload,
    setValue,
    uploaded,
  ]);

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
