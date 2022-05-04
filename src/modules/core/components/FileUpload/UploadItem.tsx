import React, { SyntheticEvent, useEffect, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { useField } from 'formik';
import { log } from '~utils/debug';

import { UploadFile, UploadItemComponentProps } from './types';
import Button from '../Button';
import Icon from '../Icon';
import { Tooltip } from '../Popover';
import ProgressBar from '../ProgressBar';

import fileReader from '../../../../lib/fileReader';

import styles from './UploadItem.css';

const MSG = defineMessages({
  removeActionText: {
    id: 'UploadItem.removeActionText',
    defaultMessage: 'Remove',
  },
});

const displayName = 'UploadItem';

const UploadItem = ({
  accept,
  error,
  idx,
  maxFileSize,
  name,
  remove,
  upload,
}: UploadItemComponentProps) => {
  const [
    ,
    {
      value: { file, uploaded },
      value,
    },
    { setValue },
  ] = useField<UploadFile>(name);

  // eslint-disable-next-line no-underscore-dangle
  const _readFiles = useMemo(
    () =>
      fileReader({
        maxFilesLimit: 1,
        maxFileSize,
        allowedTypes: accept,
      }),
    [accept, maxFileSize],
  );

  const read = useCallback(async () => {
    const [contents] = await _readFiles([file]);
    return contents;
  }, [_readFiles, file]);

  const handleRemoveClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    remove(idx);
  };

  const uploadFile = useCallback(async () => {
    if (!setValue) return;
    let readFile;
    let fileReference;
    try {
      readFile = await read();
      setValue({ ...value, preview: readFile.data });
      fileReference = await upload(readFile);
    } catch (caughtError) {
      log.error(caughtError);

      /**
       * @todo  better error handling here
       */
      setValue({ ...value, error: 'uploadError' });
      return;
    }
    setValue({ ...value, preview: readFile.data, uploaded: fileReference });
  }, [read, setValue, upload, value]);

  useEffect(() => {
    if (file && !error && !uploaded) {
      uploadFile();
    }
    // Only upload on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.uploadItem} aria-invalid={!!error}>
      <div className={styles.fileInfo}>
        <Tooltip
          placement="left"
          content={error || null}
          trigger={error ? 'hover' : null}
        >
          <span className={styles.itemIcon}>
            <Icon name="file" title={file.name} />
          </span>
        </Tooltip>
        {uploaded || error ? (
          <span>{file.name}</span>
        ) : (
          <div className={styles.itemProgress}>
            <ProgressBar value={uploaded ? 100 : 0} />
          </div>
        )}
      </div>
      <div>
        <Button
          type="button"
          onClick={handleRemoveClick}
          appearance={{ theme: 'blue' }}
          text={MSG.removeActionText}
        />
      </div>
    </div>
  );
};

UploadItem.displayName = displayName;

export default UploadItem;
