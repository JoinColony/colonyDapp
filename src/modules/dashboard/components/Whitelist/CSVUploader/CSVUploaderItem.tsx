import React, { useEffect, SyntheticEvent } from 'react';
import { defineMessages } from 'react-intl';
import { useField } from 'formik';

import { UploadItemComponentProps } from '~core/FileUpload/types';
import { UploadFile } from '~core/FileUpload';

import styles from './CSVUploaderItem.css';

import Button from '~core/Button';

const displayName = 'dashboard.Whitelist.CSVUploader.CSVUploaderItem';

const MSG = defineMessages({
  removeCSVText: {
    id: 'dashboard.Whitelist.CSVUploader.CSVUploaderItem.removeCSVText',
    defaultMessage: 'Remove',
  },
});

const CSVUploaderItem = ({
  error,
  idx,
  name,
  remove,
  upload,
  handleError,
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
      upload(value.file);
    }

    if (error && handleError) {
      handleError();
    }
  }, [file, error]);

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
