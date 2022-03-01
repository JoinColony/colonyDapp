import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';

import UploadAddressesWidget from '~dashboard/Whitelist/UploadAddressesWidget/UploadAddressesWidget';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import { Colony } from '~data/index';

import { pipe, mapPayload } from '~utils/actions';
import { isAddress } from '~utils/web3';

import styles from './AddAddressesForm.css';

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

const validationSchemaInput = yup.object({
  whitelistAddress: yup.string().required().address(),
});

const validationSchemaFile = yup.object({
  whitelistCSVUploader: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        parsedData: yup
          .array()
          .of(yup.string())
          .min(1, () => MSG.badFileError)
          .max(1000, () => MSG.uploadError)
          .test(
            'valid-wallet-addresses',
            () => MSG.invalidAddressError,
            (value) =>
              isEmpty(
                value?.filter(
                  (potentialAddress: string) => !isAddress(potentialAddress),
                ),
              ),
          ),
      }),
    ),
});

interface Props {
  colony: Colony;
}

const AddAddressesTab = ({ colony: { colonyAddress }, colony }: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const toggleShowInput = () => setShowInput(!showInput);

  const transform = useCallback(
    pipe(
      mapPayload(({ whitelistAddress, whitelistCSVUploader }) => {
        return {
          userAddresses:
            whitelistAddress !== undefined
              ? [whitelistAddress]
              : whitelistCSVUploader[0].parsedData,
          colonyAddress,
          status: true,
        };
      }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{}}
      validationSchema={
        showInput ? validationSchemaInput : validationSchemaFile
      }
      submit={ActionTypes.WHITELIST_UPDATE}
      error={ActionTypes.WHITELIST_UPDATE_ERROR}
      success={ActionTypes.WHITELIST_UPDATE_SUCCESS}
      transform={transform}
    >
      {({ errors, isValid, isSubmitting }) => (
        <div className={styles.container}>
          <UploadAddressesWidget
            colony={colony}
            errors={errors}
            isValid={isValid}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </ActionForm>
  );
};
export default AddAddressesTab;
