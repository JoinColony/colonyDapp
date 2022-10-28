import React, { useCallback, useEffect, useMemo } from 'react';

import { useField } from 'formik';
import { UploadItemComponentProps } from '~core/FileUpload/types';

import styles from './AvatarUploadItem.css';

import fileReader from '../../../../lib/fileReader';
import { UploadFile } from '../FileUpload';
import Icon from '../Icon';

const displayName = 'AvatarUploadItem';

const AvatarUploadItem = ({
  accept,
  error,
  maxFileSize,
  name,
  reset,
  upload,
  handleError,
}: UploadItemComponentProps) => {
  const [
    ,
    {
      value: { file, preview, uploaded },
      value,
    },
    { setValue },
  ] = useField<UploadFile>(name);
  const readFiles = useMemo(
    () =>
      fileReader({
        maxFilesLimit: 1,
        maxFileSize,
        allowedTypes: accept,
      }),
    [accept, maxFileSize],
  );

  const read = useCallback(async () => {
    const [contents] = await readFiles([file]);
    return contents;
  }, [file, readFiles]);

  const uploadFile = useCallback(async () => {
    let readFile;
    try {
      readFile = await read();
      const uploadedFile = await upload(readFile);
      setValue({ ...value, preview: readFile.data, uploaded: uploadedFile });
    } catch (e) {
      console.error(e);
      /**
       * @todo Improve error modes for uploading avatars.
       */
      setValue({ ...value, error: 'uploadError' });
    }
    // After successfully uploading the file we'd like to immediately remove it again.
    reset();
  }, [value, read, reset, setValue, upload]);

  useEffect(() => {
    if (file && !error && !uploaded) {
      uploadFile();
    }
    if (error) {
      handleError?.({ ...value, file });

      // reset the form to allow for another upload attempt
      reset();
    }
    // Only on first render
  }, [handleError, file, error, uploadFile, uploaded, value, reset]);

  return (
    <div className={styles.main}>
      {!error ? (
        <div
          className={styles.previewImage}
          style={{ backgroundImage: preview ? `url(${preview}` : undefined }}
        >
          <div className={styles.overlay}>
            <div className={styles.loader} />
          </div>
        </div>
      ) : (
        <div className={styles.error}>
          <Icon name="file" appearance={{ size: 'large' }} title={error} />
        </div>
      )}
    </div>
  );
};

AvatarUploadItem.displayName = displayName;

export default AvatarUploadItem;
