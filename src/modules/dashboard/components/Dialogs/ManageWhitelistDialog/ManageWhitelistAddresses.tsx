import React, { useState, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';

import Button from '~core/Button';
import CSVUploader from '~core/CSVUploader';
import { ActionForm, InputLabel, Input } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import { UploadAddressesWidget } from '~Components/Whitelist/UploadAddressesWidget/';
import { pipe, mapPayload } from '~utils/actions';
import { isAddress } from '~utils/web3';

import AgreementDialog from '../AgreementDialog';

import DownloadTemplate from '../../DownloadTemplate';

const MSG = defineMessages({
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
  badFileError: {
    id: 'dashboard.Whitelist.UploadAddressesWidget.badFileError',
    defaultMessage: `.csv invalid or incomplete. Please ensure the file contains a single column with one address on each row.`,
  },
  invalidAddressError: {
    id: `dashboard.Whitelist.UploadAddressesWidget.badFileError.invalidAddressError`,
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
  whitelistAgreementHash?: string | null;
}

const ManageWhitelistAddresses = ({
  colony: { colonyAddress },
  colony,
  whitelistAgreementHash,
}: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const toggleShowInput = () => setShowInput(!showInput);
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);

  const { walletAddress, username, ethereal } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const userHasPermission = hasRegisteredProfile && canAdminister(allUserRoles);

  const openAgreementDialog = useDialog(AgreementDialog);

  const openDialog = useCallback(
    () =>
      whitelistAgreementHash &&
      openAgreementDialog({
        agreementHash: whitelistAgreementHash,
      }),
    [openAgreementDialog, whitelistAgreementHash],
  );

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
              />
            </div>
          )}
          <div className={styles.buttonsContainer}>
            <div className={styles.agreeemntButton}>
              {whitelistAgreementHash && (
                <Button
                  appearance={{ theme: 'blue' }}
                  onClick={openDialog}
                  text={MSG.agreement}
                />
              )}
            </div>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              text={{ id: 'button.confirm' }}
              disabled={!userHasPermission || !isValid || isSubmitting}
              type="submit"
              loading={isSubmitting}
            />
          </div>
        </div>
      )}
    </ActionForm>
  );
};

ManageWhitelistAddresses.displayName =
  'dashboard.ManageWhitelistDialog.ManageWhitelistAddresses';

export default ManageWhitelistAddresses;
