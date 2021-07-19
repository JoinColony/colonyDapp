import React, { useCallback } from 'react';
import { defineMessage } from 'react-intl';

import {
  useWhitelistedUsersQuery,
  useWhitelistAgreementQuery,
  useLoggedInUser,
  Colony,
} from '~data/index';
import { MiniSpinnerLoader } from '~core/Preloaders';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';

import { useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

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
  colony: Colony;
}

const Whitelist = ({ colony: { colonyAddress }, colony }: Props) => {
  const { data: usersData, loading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
  });
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const userHasPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  const openAgreementDialog = useDialog(AgreementDialog);

  const {
    data: agreementData,
    loading: agreementLoading,
  } = useWhitelistAgreementQuery({
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
      {(usersData?.whitelistedUsers?.length && (
        <WhitelistAddresses
          colonyAddress={colonyAddress}
          users={usersData.whitelistedUsers}
        />
      )) ||
        null}
      <div className={styles.buttonsContainer}>
        <div className={styles.agreeemntButton}>
          {loading && <MiniSpinnerLoader />}
          {!agreementLoading && agreementData?.whitelistAgreement && (
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
          disabled={!userHasPermission}
        />
      </div>
    </div>
  );
};

export default Whitelist;
