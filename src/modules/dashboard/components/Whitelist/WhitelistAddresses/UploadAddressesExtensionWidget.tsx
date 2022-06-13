import React, { useState, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';

import {
  validationSchemaInput,
  validationSchemaFile,
} from '~utils/whitelistValidation';
import UploadAddresses from '~core/UploadAddresses';
import { ActionForm } from '~core/Fields';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import AgreementDialog from '../AgreementDialog';

import styles from './UploadAddressesExtensionWidget.css';

const MSG = defineMessages({
  inputLabel: {
    id: `dashboard.Whitelist.WhitelistAddresses.UploadAddressesExtensionWidget.inputLabel`,
    defaultMessage: 'Add wallet address that has passed KYC/AML',
  },
  agreement: {
    id: `dashboard.Whitelist.WhitelistAddresses.UploadAddressesExtensionWidget.agreement`,
    defaultMessage: 'Agreement',
  },
});

interface Props {
  colony: Colony;
  userHasPermission: boolean;
  whitelistAgreementHash?: string | null;
}

const UploadAddressesExtensionWidget = ({
  colony: { colonyAddress },
  userHasPermission,
  whitelistAgreementHash,
}: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const toggleShowInput = () => setShowInput(!showInput);
  const history = useHistory();
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
      withMeta({ history }),
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
      {({ errors, isValid, isSubmitting }: FormikProps<{}>) => (
        <>
          <div className={styles.container}>
            <UploadAddresses
              userHasPermission={userHasPermission}
              errors={errors}
              isSubmitting={isSubmitting}
              showInput={showInput}
              toggleShowInput={toggleShowInput}
            />
          </div>
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
        </>
      )}
    </ActionForm>
  );
};

UploadAddressesExtensionWidget.displayName =
  'dashboard.Whitelist.WhitelistAddresses.UploadAddressesExtensionWidget';

export default UploadAddressesExtensionWidget;
