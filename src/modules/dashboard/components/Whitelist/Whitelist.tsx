import React, { useCallback } from 'react';
import { defineMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import {
  useWhitelistedUsersQuery,
  useWhitelistAgreementQuery,
} from '~data/index';
import { MiniSpinnerLoader } from '~core/Preloaders';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';

import { Address } from '~types/index';

import AgreementDialog from './AgreementDialog';
import styles from './Whitelist.css';
import UploadAddressesWidget from './UploadAddressesWidget';
import WhitelistAddresses from './WhitelistAddresses';

const MSG = defineMessage({
  loadingText: {
    id: 'dashboard.Whitelist.loadingText',
    defaultMessage: 'Loading whitelist',
  },
  agreement: {
    id: 'dashboard.Extensions.WhitelisExtension.agreement',
    defaultMessage: 'Agreement',
  },
});

interface Props {
  colonyAddress: Address;
}

const Whitelist = ({ colonyAddress }: Props) => {
  const openAgreementDialog = useDialog(AgreementDialog);

  const { data, loading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
  });
  const { data: agreementData } = useWhitelistAgreementQuery({
    variables: { colonyAddress },
  });

  const openDialog = useCallback(
    () =>
      agreementData?.whitelistAgreement &&
      openAgreementDialog({ agreementText: agreementData?.whitelistAgreement }),
    [openAgreementDialog, agreementData],
  );

  return (
    <div>
      <UploadAddressesWidget />
      {loading && <MiniSpinnerLoader loadingText={MSG.loadingText} />}
      {(data?.whitelistedUsers?.length && (
        <WhitelistAddresses
          colonyAddress={colonyAddress}
          users={data.whitelistedUsers}
        />
      )) ||
        null}
      <div className={styles.buttonsContainer}>
        <div className={styles.agreeemntButton}>
          {agreementData?.whitelistAgreement && (
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
          // temporary (outside of the scope of the issue)
          disabled
        />
      </div>
    </div>
  );
};

export default Whitelist;
