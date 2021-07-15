import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { ActionForm, InputLabel } from '~core/Fields';
import Button from '~core/Button';

import { ActionTypes } from '~redux/index';

import CSVUploader from '../CSVUploader';

import DownloadTemplate from './DownloadTemplate';
import styles from './UploadAddressesWidget.css';

const MSG = defineMessages({
  inputLabel: {
    id: `dashboard.Whitelist.UploadAddressesWidget.inputLabel`,
    defaultMessage: 'Add wallet address that has passed KYC/AML',
  },
  uploadLabel: {
    id: `dashboard.Whitelist.UploadAddressesWidget.uploadLabel`,
    defaultMessage: 'Upload .csv with a list of addresses',
  },
  upload: {
    id: `dashboard.Whitelist.UploadAddressesWidget.upload`,
    defaultMessage: 'Upload .csv',
  },
  input: {
    id: `dashboard.Whitelist.UploadAddressesWidget.input`,
    defaultMessage: 'Input',
  },
  uploadError: {
    id: `dashboard.Whitelist.UploadAddressesWidget.uploadError`,
    defaultMessage: `We do not accept more than 100 addresses at a time, please upload a smaller amount.`,
  },
  inputError: {
    id: `dashboard.Whitelist.UploadAddressesWidget.inputError`,
    defaultMessage: `TODO`,
  },
  badFileError: {
    id: 'dashboard.Whitelist.UploadAddressesWidget.badFileError',
    defaultMessage: `.csv invalid or incomplete. Please ensure the file contains a single column with one address on each row.`,
  },
});

const validationSchema = yup.object({
  whitelistCSVUploader: yup.array().of(
    yup.object().shape({
      parsedData: yup
        .array()
        .of(yup.string())
        .min(1, () => MSG.badFileError)
        .max(100, () => MSG.uploadError),
    }),
  ),
});

const UploadAddressesWidget = () => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const toggleShowInput = () => setShowInput(!showInput);
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);

  return (
    <ActionForm
      initialValues={{}}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES}
      error={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES_ERROR}
      success={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES_SUCCESS}
    >
      {({ errors }) => (
        <div className={styles.container}>
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
                disabled={processingCSVData}
              />
            </div>
          </div>
          {showInput ? (
            <div className={styles.inputContainer}>
              <input name="whitelistAddress" className={styles.input} />
              {false && (
                <span className={styles.validationError}>
                  <FormattedMessage {...MSG.inputError} />
                </span>
              )}
            </div>
          ) : (
            <div>
              <CSVUploader
                name="whitelistCSVUploader"
                error={
                  errors.whitelistCSVUploader &&
                  errors.whitelistCSVUploader[0].parsedData
                }
                processingData={processingCSVData}
                setProcessingData={setProcessingCSVData}
              />
            </div>
          )}
        </div>
      )}
    </ActionForm>
  );
};

UploadAddressesWidget.displayName = 'dashboard.Whitelist.UploadAddressesWidget';

export default UploadAddressesWidget;
