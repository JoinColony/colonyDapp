import React, { useCallback } from 'react';
import { defineMessage } from 'react-intl';

import {
  useWhitelistedUsersQuery,
  useWhitelistAgreementHashQuery,
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
  const { data: usersData, loading: usersLoading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
  });
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const userHasPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  const openAgreementDialog = useDialog(AgreementDialog);
  const {
    data: agreementHashData,
    loading: agreementHashLoading,
  } = useWhitelistAgreementHashQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const openDialog = useCallback(
    () =>
      agreementHashData?.whitelistAgreementHash &&
      openAgreementDialog({
        agreementHash: agreementHashData?.whitelistAgreementHash,
      }),
    [openAgreementDialog, agreementHashData],
  );

  return (
    <div>
      <UploadAddressesWidget />
      {usersLoading && <MiniSpinnerLoader loadingText={MSG.loadingText} />}
      {(usersData?.whitelistedUsers?.length && (
        <WhitelistAddresses
          colonyAddress={colonyAddress}
          users={usersData.whitelistedUsers}
        />
      )) ||
        null}
      <div className={styles.buttonsContainer}>
        <div className={styles.agreeemntButton}>
          {agreementHashLoading && <MiniSpinnerLoader />}
          {!agreementHashLoading &&
            agreementHashData?.whitelistAgreementHash && (
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
