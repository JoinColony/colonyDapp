import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';

import { InputLabel, Input } from '~core/Fields';
import Button from '~core/Button';
import CSVUploader from '~core/CSVUploader';

import DownloadTemplate from './DownloadTemplate';

import styles from './UploadAddresses.css';

const MSG = defineMessages({
  inputLabel: {
    id: `core.UploadAddresses.inputLabel`,
    defaultMessage: 'Add wallet address to whitelist',
  },
  uploadLabel: {
    id: `core.UploadAddresses.uploadLabel`,
    defaultMessage: 'Upload .csv with a list of addresses',
  },
  upload: {
    id: `core.UploadAddresses.upload`,
    defaultMessage: 'Upload .csv',
  },
  input: {
    id: `core.UploadAddresses.input`,
    defaultMessage: 'Input',
  },
});

interface Props {
  userHasPermission: boolean;
  errors?: any;
  isSubmitting: boolean;
  showInput: boolean;
  toggleShowInput: () => void;
  formSuccess?: boolean;
  setFormSuccess?: (isSuccess: boolean) => void;
  inputLabelMsg?: MessageDescriptor | undefined;
  inputSuccessMsg?: MessageDescriptor | undefined;
  fileSuccessMsg?: MessageDescriptor | undefined;
}

const UploadAddresses = ({
  userHasPermission,
  errors,
  isSubmitting,
  showInput,
  toggleShowInput,
  formSuccess,
  setFormSuccess,
  inputLabelMsg = MSG.inputLabel,
  inputSuccessMsg,
  fileSuccessMsg,
}: Props) => {
  const [hasFile, setHasFile] = useState<boolean>(false);
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);
  const [touchedAfterSuccess, setTouchedAfterSuccess] = useState<boolean>(
    false,
  );

  const handleSetHasFile = useCallback(
    (value: boolean) => {
      setHasFile(value);
    },
    [setHasFile],
  );

  const handleChange = useCallback(() => {
    // Remove Success msg when input changes
    if (formSuccess) {
      setTouchedAfterSuccess(true);
      if (setFormSuccess) {
        setFormSuccess(false);
      }
    } else {
      setTouchedAfterSuccess(false);
    }
  }, [formSuccess, setFormSuccess, setTouchedAfterSuccess]);

  const statusMsg = useMemo(() => {
    if (!formSuccess || (!showInput && !hasFile) || touchedAfterSuccess)
      return undefined;
    return showInput ? inputSuccessMsg : fileSuccessMsg;
  }, [
    hasFile,
    formSuccess,
    showInput,
    touchedAfterSuccess,
    inputSuccessMsg,
    fileSuccessMsg,
  ]);

  return (
    <>
      <div className={styles.actionsContainer}>
        <InputLabel
          label={showInput ? inputLabelMsg : MSG.uploadLabel}
          appearance={{ colorSchema: 'grey' }}
        />
        <div className={styles.actionsSubContainer}>
          {!showInput && <DownloadTemplate />}
          <Button
            appearance={{ theme: 'blue' }}
            text={showInput ? MSG.upload : MSG.input}
            onClick={toggleShowInput}
            disabled={processingCSVData || isSubmitting}
          />
        </div>
      </div>
      {showInput ? (
        <div className={styles.inputContainer}>
          <Input
            name="whitelistAddress"
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            disabled={!userHasPermission || isSubmitting}
            status={statusMsg}
            onChange={handleChange}
          />
        </div>
      ) : (
        <div
          className={
            !errors.whitelistCSVUploader ? styles.uploaderContainer : ''
          }
        >
          <CSVUploader
            name="whitelistCSVUploader"
            error={
              errors.whitelistCSVUploader &&
              errors.whitelistCSVUploader[0].parsedData
            }
            processingData={processingCSVData}
            setProcessingData={setProcessingCSVData}
            status={statusMsg}
            setHasFile={handleSetHasFile}
          />
        </div>
      )}
    </>
  );
};

UploadAddresses.displayName = 'core.UploadAddresses';

export default UploadAddresses;
