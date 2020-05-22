import React, { useCallback, useEffect, useMemo } from 'react';

import { useField } from 'formik';
import { UploadItemComponentProps } from '~core/FileUpload/types';
import { log } from '~utils/debug';

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
      setValue({ ...value, preview: readFile.data });
      await upload(readFile);
    } catch (e) {
      log(e);

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
    // Only on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
