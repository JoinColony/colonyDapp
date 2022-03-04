import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';

// import UploadAddresses from '~core/UploadAddresses';

import styles from './AddAddressesTab.css';

const MSG = defineMessages({
  inputLabel: {
    id: `dashboard.Dialogs.ManageWhitelistDialog.AddAddressesTab.inputLabel`,
    defaultMessage: 'Add wallet address to whitelist',
  },
  uploadLabel: {
    id: `dashboard.Dialogs.ManageWhitelistDialog.AddAddressesTab.uploadLabel`,
    defaultMessage: 'Upload .csv with a list of addresses',
  },
  upload: {
    id: `dashboard.Dialogs.ManageWhitelistDialog.AddAddressesTab.upload`,
    defaultMessage: 'Upload .csv',
  },
  input: {
    id: `dashboard.Dialogs.ManageWhitelistDialog.AddAddressesTab.input`,
    defaultMessage: 'Input',
  },
  uploadError: {
    id: `dashboard.Dialogs.ManageWhitelistDialog.AddAddressesTab.uploadError`,
    defaultMessage: `We do not accept more than 100 addresses at a time, please upload a smaller amount.`,
  },
  badFileError: {
    id: 'dashboard.Dialogs.ManageWhitelistDialog.AddAddressesTab.badFileError',
    defaultMessage: `.csv invalid or incomplete. Please ensure the file contains a single column with one address on each row.`,
  },
  invalidAddressError: {
    id: `dashboard.Dialogs.ManageWhitelistDialog.AddAddressesTab.invalidAddressError`,
    defaultMessage: `It looks like one of your addresses is invalid. Please review our required format & validate that your file matches our requirement. Once fixed, please try again.`,
  },
});

interface Props {
  colony: Colony;
}

const AddAddressesTab = ({ colony: { colonyAddress }, colony }: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);

  return (
    <div className={styles.container}>
      {/* <UploadAddresses
        colony={colony}
        errors={errors}
        isValid={isValid}
        isSubmitting={isSubmitting}
      /> */}
    </div>
  );
};
export default AddAddressesTab;
