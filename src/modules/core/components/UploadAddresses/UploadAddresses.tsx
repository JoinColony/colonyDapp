import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';

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
  agreement: {
    id: `core.UploadAddresses.agreement`,
    defaultMessage: 'Agreement',
  },
  input: {
    id: `core.UploadAddresses.input`,
    defaultMessage: 'Input',
  },
  whitelistedInputSuccess: {
    id: 'dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.whitelisted',
    defaultMessage: `Address is whitelisted now. You can add another one or close modal.`,
  },
  whitelistedFileSuccess: {
    id: 'dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.whitelisted',
    defaultMessage: `File was added. You can add another one or close modal.`,
  },
});

interface Props {
  userHasPermission: boolean;
  errors?: any;
  isSubmitting: boolean;
  showInput: boolean;
  toggleShowInput: () => void;
  submitSuccess?: boolean;
  toggleSubmitSuccess?: () => void;
}

const UploadAddresses = ({
  userHasPermission,
  errors,
  isSubmitting,
  showInput,
  toggleShowInput,
  submitSuccess,
  toggleSubmitSuccess,
}: Props) => {
  const [hasFile, setHasFile] = useState<boolean>(false);
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);
  const [touchedAfterSuccess, setTouchedAfterSuccess] = useState<boolean>(
    false,
  );

  const handleSetHasFile = useCallback(
    (value: boolean) => {
      setHasFile(value);
      if (submitSuccess && toggleSubmitSuccess) {
        toggleSubmitSuccess();
      }
    },
    [setHasFile, submitSuccess, toggleSubmitSuccess],
  );

  const handleChange = useCallback(() => {
    if (submitSuccess) {
      setTouchedAfterSuccess(true);
      if (toggleSubmitSuccess) {
        toggleSubmitSuccess();
      }
    } else {
      setTouchedAfterSuccess(false);
    }
  }, [submitSuccess, setTouchedAfterSuccess, toggleSubmitSuccess]);

  const getStatus = useMemo(() => {
    if (!submitSuccess || touchedAfterSuccess || !hasFile) return undefined;
    return showInput ? MSG.whitelistedInputSuccess : MSG.whitelistedFileSuccess;
  }, [hasFile, showInput, submitSuccess, touchedAfterSuccess]);

  return (
    <>
      <div className={styles.actionsContainer}>
        <InputLabel
          label={showInput ? MSG.inputLabel : MSG.uploadLabel}
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
            status={getStatus}
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
            status={getStatus}
            setHasFile={handleSetHasFile}
          />
        </div>
      )}
    </>
  );
};

UploadAddresses.displayName = 'core.UploadAddresses';

export default UploadAddresses;
