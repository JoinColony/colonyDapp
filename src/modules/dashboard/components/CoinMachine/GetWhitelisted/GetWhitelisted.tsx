import React, { useEffect, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';
import { Address } from '~types/index';

import {
  useWhitelistPolicyQuery,
  UserWhitelistStatus,
  useWhitelistAgreementHashQuery,
  useMetaColonyQuery,
  useLoggedInUser,
} from '~data/index';

import { useDialog } from '~core/Dialog';
import AgreementDialog from '~dashboard/Whitelist/AgreementDialog';
import CompleteKYCDialog from '../CompleteKYCDialog';
import SynapsKYCDialog from '../SynapsKYCDialog';

const MSG = defineMessages({
  getWhitelisted: {
    id: 'dashbord.CoinMachine.BuyWidget.getWhitelisted',
    defaultMessage: 'Get whitelisted',
  },
});

type Props = {
  colonyAddress: Address;
  userStatus?: UserWhitelistStatus;
};

const displayName = 'dashboard.CoinMachine.GetWhitelisted';

const GetWhitelisted = ({ colonyAddress, userStatus }: Props) => {
  const { data: whitelistPolicyData } = useWhitelistPolicyQuery({
    variables: { colonyAddress },
  });
  const { data } = useMetaColonyQuery();
  const { username, ethereal } = useLoggedInUser();

  const userHasProfile = !!username && !ethereal;

  const openAgreementDialog = useDialog(AgreementDialog);
  const openCompleteKYCDialog = useDialog(CompleteKYCDialog);
  const openSynapsDialog = useDialog(SynapsKYCDialog);

  const signatureRequired =
    userHasProfile &&
    whitelistPolicyData?.whitelistPolicy.agreementRequired &&
    !userStatus?.userSignedAgreement;

  const isKYCRequired =
    userHasProfile &&
    whitelistPolicyData?.whitelistPolicy.kycRequired &&
    !userStatus?.userIsApproved;

  const { data: agreementHashData, loading } = useWhitelistAgreementHashQuery({
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

  const openKYCDialog = useCallback(() => {
    /*
     * @TEMP Enable KYC Oracle for the /rc colony on QA
     */
    return colonyAddress === '0xA838cC8a369439091C320bEdFB6E339b66Ae8A6F'
      ? openSynapsDialog({ colonyAddress })
      : openCompleteKYCDialog();
  }, [openCompleteKYCDialog, openSynapsDialog, colonyAddress]);

  useEffect(() => {
    if (!userStatus || !whitelistPolicyData || loading) return;
    if (isKYCRequired) {
      openKYCDialog();
    } else if (signatureRequired) {
      openDialog();
    }
  }, [
    isKYCRequired,
    signatureRequired,
    openKYCDialog,
    openDialog,
    userStatus,
    whitelistPolicyData,
    loading,
  ]);

  const showWhitelistModal = useCallback(() => {
    if (isKYCRequired) {
      openKYCDialog();
    } else if (signatureRequired) {
      openDialog();
    }
  }, [isKYCRequired, signatureRequired, openKYCDialog, openDialog]);

  return (
    <Button
      text={MSG.getWhitelisted}
      appearance={{ theme: 'primary', size: 'large' }}
      disabled={!userHasProfile}
      onClick={showWhitelistModal}
    />
  );
};

GetWhitelisted.displayName = displayName;

export default GetWhitelisted;
