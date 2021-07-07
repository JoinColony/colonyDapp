import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ActionForm, InputLabel } from '~core/Fields';
import FileUpload from '~core/FileUpload';
import Button from '~core/Button';

import { ActionTypes } from '~redux/index';

import styles from './UploadAddressesWidget.css';

const MSG = defineMessages({
  inputLabel: {
    id: `dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.inputLabel`,
    defaultMessage: 'Add wallet address that has passed KYC/AML',
  },
  uploadLabel: {
    id: `dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.uploadLabel`,
    defaultMessage: 'Upload .csv with a list of addresses',
  },
  upload: {
    id: `dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.upload`,
    defaultMessage: 'Upload .csv',
  },
  input: {
    id: `dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.input`,
    defaultMessage: 'Input',
  },
  uploadError: {
    id: `dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.uploadError`,
    defaultMessage: `It is possible to upload no more than 100x addresses at a time. \nPlease consider to upload a smaller amount of addresses.`,
  },
  inputError: {
    id: `dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.inputError`,
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
            <Button
              appearance={{ theme: 'blue' }}
              text={showInput ? MSG.upload : MSG.input}
              onClick={toggleShowInput}
            />
          </div>
          {showInput ? (
            <div className={styles.inputContainer}>
              <input name="tokenAddress" className={styles.input} />
              {false && (
                <span className={styles.validationError}>
                  <FormattedMessage {...MSG.inputError} />
                </span>
              )}
            </div>
          ) : (
            <div>
              <FileUpload name="avatarUploader" upload={() => null} />
            </div>
          )}
        </div>
      )}
    </ActionForm>
  );
};

UploadAddressesWidget.displayName =
  'dashboard.Extensions.WhitelistExtension.UploadAddressesWidget';

export default UploadAddressesWidget;
