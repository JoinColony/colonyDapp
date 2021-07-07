import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ActionForm, InputLabel, InputStatus } from '~core/Fields';

import { ActionTypes } from '~redux/index';

import styles from './UploadAddressesWidget.css';

export interface FormValues {
}

const MSG = defineMessages({
  inputLabel: {
    id: 'dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.inputLabel',
    defaultMessage: 'Add wallet address that has passed KYC/AML',
  },
  uploadLabel: {
    id: 'dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.uploadLabel',
    defaultMessage: 'Upload .csv with a list of addresses',
  },
  upload: {
    id: 'dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.upload',
    defaultMessage: 'Upload .csv',
  },
  input: {
    id: 'dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.input',
    defaultMessage: 'Input',
  },
  uploadError: {
    id: 'dashboard.Extensions.WhitelistExtension.UploadAddressesWidget.uploadError',
    defaultMessage: `It is possible to upload no more than 100x addresses at a time. \nPlease consider to upload a smaller amount of addresses.`,
  },
});

const UploadAddressesWidget = () => {
  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES}
      error={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES_ERROR}
      success={ActionTypes.COLONY_EXTENSION_UPLOAD_ADDRESSES_SUCCESS}
    >
      {() => (
        <div className={styles.uploadContainer}>
          <div className={styles.inputContainer}>
            <InputLabel
              label={MSG.inputLabel}
              appearance={{ colorSchema: 'grey' }}
            />
            <input
              name="tokenAddress"
              className={styles.input}
            />
            {true && (
              <span className={styles.validationError}>
                <FormattedMessage
                  {...MSG.uploadError}
                />
              </span>
            )}
          </div>
          <div className={styles.uploadContainer}>
            <div>Upload</div>
            {false && (
              <span className={styles.validationError}>
                <FormattedMessage
                  {...MSG.uploadError}
                />
              </span>
            )}
          </div>
        </div>
      )}
    </ActionForm>
  );
};

UploadAddressesWidget.displayName = 'dashboard.Extensions.WhitelistExtension.UploadAddressesWidget';

export default UploadAddressesWidget;
