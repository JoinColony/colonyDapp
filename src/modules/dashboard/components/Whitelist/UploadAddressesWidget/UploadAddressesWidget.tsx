import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ActionForm, InputLabel } from '~core/Fields';
import FileUpload from '~core/FileUpload';
import Button from '~core/Button';

import { ActionTypes } from '~redux/index';

import DownloadTemplate from './DownloadTemplate';
import styles from './UploadAddressesWidget.css';

const MIME_TYPES = ['text/csv'];

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
    defaultMessage: `It is possible to upload no more than 100x addresses at a time. \nPlease consider to upload a smaller amount of addresses.`,
  },
  inputError: {
    id: `dashboard.Whitelist.UploadAddressesWidget.inputError`,
    defaultMessage: `TODO`,
  },
});

const UploadAddressesWidget = () => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const toggleShowInput = () => setShowInput(!showInput);

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES}
      error={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES_ERROR}
      success={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES_SUCCESS}
    >
      {() => (
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
              <FileUpload
                name="whitelistUploader"
                upload={() => null}
                dropzoneOptions={{
                  accept: MIME_TYPES,
                }}
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
