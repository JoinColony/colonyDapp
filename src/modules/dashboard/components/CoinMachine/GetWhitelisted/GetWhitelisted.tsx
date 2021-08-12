import React, { useEffect, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';
import { Address } from '~types/index';

import {
  useWhitelistPolicyQuery,
  UserWhitelistStatus,
  useWhitelistAgreementHashQuery,
} from '~data/index';

import { useDialog } from '~core/Dialog';
import AgreementDialog from '~dashboard/Whitelist/AgreementDialog';
import CompleteKYCDialog from '../CompleteKYCDialog';

const MSG = defineMessages({
  getWhitelisted: {
    id: 'dashbord.CoinMachine.BuyWidget.getWhitelisted',
    defaultMessage: 'Get whitelisted',
  },
});

type Props = {
  disabled: boolean;
  colonyAddress: Address;
  userStatus?: UserWhitelistStatus;
};

const displayName = 'dashboard.CoinMachine.GetWhitelisted';

const GetWhitelisted = ({ disabled, colonyAddress, userStatus }: Props) => {
  const { data: whitelistPolicyData } = useWhitelistPolicyQuery({
    variables: { colonyAddress },
  });

  const openAgreementDialog = useDialog(AgreementDialog);
  const openCompleteKYCDialog = useDialog(CompleteKYCDialog);

  const signatureRequired =
    !disabled &&
    whitelistPolicyData?.whitelistPolicy.agreementRequired &&
    !userStatus?.userSignedAgreement;

  const isKYCRequired =
    !disabled &&
    whitelistPolicyData?.whitelistPolicy.kycRequired &&
    !userStatus?.userIsApproved;

  const { data: agreementHashData } = useWhitelistAgreementHashQuery({
    variables: { colonyAddress },
    skip: !signatureRequired,
  });

  const openDialog = useCallback(
    () =>
      agreementHashData?.whitelistAgreementHash &&
      openAgreementDialog({
        agreementHash: agreementHashData?.whitelistAgreementHash,
        colonyAddress,
        isSignable: true,
        back: () => {},
      }),
    [agreementHashData, openAgreementDialog, colonyAddress],
  );

  const openKYCDialog = useCallback(
    () =>
      openCompleteKYCDialog({
        isKYCRequired,
        signatureRequired,
        isWhitelisted: userStatus?.userIsWhitelisted,
        back: () => {},
      }),
    [isKYCRequired, signatureRequired],
  );

  useEffect(() => {
    if (isKYCRequired) {
      openKYCDialog()
    }
    else if (signatureRequired) {
      openDialog();
    }
  }, [openDialog, signatureRequired]);

  return (
    <Button
      text={MSG.getWhitelisted}
      appearance={{ theme: 'primary', size: 'large' }}
      disabled={disabled}
    />
  );
};

GetWhitelisted.displayName = displayName;

export default GetWhitelisted;
