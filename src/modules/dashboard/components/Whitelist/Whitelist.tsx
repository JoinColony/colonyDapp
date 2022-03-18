import React, { useMemo } from 'react';
import { defineMessage } from 'react-intl';

import { MiniSpinnerLoader, SpinnerLoader } from '~core/Preloaders';
import {
  useWhitelistedUsersQuery,
  useWhitelistPoliciesQuery,
  Colony,
  useLoggedInUser,
  AnyUser,
} from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { canAdminister, hasRoot } from '~modules/users/checks';
import { WhitelistPolicy } from '~types/index';

import AgreementEmbed from './AgreementEmbed';
import UploadAddressesExtensionWidget from './WhitelistAddresses/UploadAddressesExtensionWidget';
import WhitelistAddresses from './WhitelistAddresses';

import styles from './Whitelist.css';

const MSG = defineMessage({
  loadingText: {
    id: 'dashboard.Whitelist.loadingText',
    defaultMessage: 'Loading whitelist',
  },
  notSignedTitle: {
    id: 'dashboard.Whitelist.notSignedTitle',
    defaultMessage: 'Addresses that have yet to sign the Agreement',
  },
});

interface Props {
  colony: Colony;
}

const Whitelist = ({ colony: { colonyAddress }, colony }: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const userHasProfile = !!username && !ethereal;

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const canAdministerWhitelist =
    userHasProfile && canAdminister(allUserRoles) && hasRoot(allUserRoles);

  const { data: usersData, loading: usersLoading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });
  const whitelistedUsers = usersData?.whitelistedUsers || [];

  const {
    data: whitelistPolicies,
    loading: loadingWhitelistPolicies,
  } = useWhitelistPoliciesQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });
  const { policyType, agreementHash = '' } =
    whitelistPolicies?.whitelistPolicies || {};

  const kycBasedPolicies =
    policyType === WhitelistPolicy.KycOnly ||
    policyType === WhitelistPolicy.KycAndAgreement;

  const usersSignaturesStatus = useMemo(
    () => ({
      haveSigned: whitelistedUsers.filter(
        (whitelistedUser) => whitelistedUser?.agreementSigned,
      ),
      notSigned: whitelistedUsers.filter(
        (whitelistedUser) =>
          whitelistedUser?.approved && !whitelistedUser?.agreementSigned,
      ),
    }),
    [whitelistedUsers],
  );

  if (loadingWhitelistPolicies) {
    return (
      <div className={styles.loaderContainer}>
        <SpinnerLoader appearance={{ size: 'huge', theme: 'primary' }} />
      </div>
    );
  }

  if (canAdministerWhitelist) {
    return (
      <div>
        {kycBasedPolicies && (
          <UploadAddressesExtensionWidget
            colony={colony}
            userHasPermission={canAdministerWhitelist}
            whitelistAgreementHash={
              whitelistPolicies?.whitelistPolicies?.agreementHash
            }
          />
        )}
        {policyType === WhitelistPolicy.AgreementOnly && (
          <AgreementEmbed agreementHash={agreementHash} />
        )}
        {usersLoading && <MiniSpinnerLoader loadingText={MSG.loadingText} />}
        {!usersLoading && policyType === WhitelistPolicy.KycAndAgreement && (
          <>
            <WhitelistAddresses
              colony={colony}
              users={usersSignaturesStatus.haveSigned as AnyUser[]}
              canRemoveUser={kycBasedPolicies}
            />
            <WhitelistAddresses
              colony={colony}
              users={usersSignaturesStatus.notSigned as AnyUser[]}
              canRemoveUser={kycBasedPolicies}
              title={MSG.notSignedTitle}
            />
          </>
        )}
        {!usersLoading && policyType !== WhitelistPolicy.KycAndAgreement && (
          <WhitelistAddresses
            colony={colony}
            users={whitelistedUsers as AnyUser[]}
            canRemoveUser={kycBasedPolicies}
          />
        )}
      </div>
    );
  }
  return null;
};

export default Whitelist;
