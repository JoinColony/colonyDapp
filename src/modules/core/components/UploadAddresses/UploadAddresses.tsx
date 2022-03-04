import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import { InputLabel, Input } from '~core/Fields';
import Button from '~core/Button';
import CSVUploader from '~core/CSVUploader';
import { Colony, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { canAdminister } from '~modules/users/checks';

// import AgreementDialog from '../AgreementDialog';

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
});

interface Props {
  colony: Colony;
  // whitelistAgreementHash?: string | null;
  errors?: any;
  // isValid?: boolean;
  isSubmitting?: boolean;
  showInput: boolean;
  toggleShowInput: () => void;
}

const UploadAddresses = ({
  colony,
  errors,
  isSubmitting,
  showInput,
  toggleShowInput,
}: Props) => {
  // const toggleShowInput = () => setShowInput(!showInput);
  const [processingCSVData, setProcessingCSVData] = useState<boolean>(false);

  const { walletAddress, username, ethereal } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const userHasPermission = hasRegisteredProfile && canAdminister(allUserRoles);
  console.log('UploadAddresses - isSubmitting: ', isSubmitting);
  console.log('showInput: ', showInput);
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
    </>
  );
};

UploadAddresses.displayName = 'core.UploadAddresses';

export default UploadAddresses;
