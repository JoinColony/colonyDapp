import React, { useEffect, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';
import { Address } from '~types/index';

import {
  useWhitelistPoliciesQuery,
  UserWhitelistStatus,
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
  const {
    data: whitelistPolicies,
    loading: loadingWhitelistPolicies,
  } = useWhitelistPoliciesQuery({
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
    !!whitelistPolicies?.whitelistPolicies?.agreementHash &&
    !userStatus?.userSignedAgreement;

  const isKYCRequired =
    userHasProfile &&
    whitelistPolicies?.whitelistPolicies?.useApprovals &&
    !userStatus?.userIsApproved;

  const openDialog = useCallback(
    () =>
      whitelistPolicies?.whitelistPolicies?.agreementHash &&
      openAgreementDialog({
        agreementHash: whitelistPolicies?.whitelistPolicies?.agreementHash,
        colonyAddress,
        isSignable: true,
        back: () => {},
      }),
    [whitelistPolicies, openAgreementDialog, colonyAddress],
  );

  const openKYCDialog = useCallback(() => {
    return data?.processedMetaColony
      ? openSynapsDialog({ colonyAddress })
      : openCompleteKYCDialog();
  }, [data, openSynapsDialog, colonyAddress, openCompleteKYCDialog]);

  useEffect(() => {
    if (!userStatus || !whitelistPolicies || loadingWhitelistPolicies) {
      return;
    }
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
    whitelistPolicies,
    loadingWhitelistPolicies,
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
