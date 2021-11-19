import React from 'react';
import { defineMessage } from 'react-intl';

import { MiniSpinnerLoader, SpinnerLoader } from '~core/Preloaders';

import {
  useWhitelistedUsersQuery,
  useWhitelistPoliciesQuery,
  Colony,
} from '~data/index';
import { WhitelistPolicy } from '~types/index';

import AgreementEmbed from './AgreementEmbed';
import UploadAddressesWidget from './UploadAddressesWidget';
import WhitelistAddresses from './WhitelistAddresses';

import styles from './Whitelist.css';

const MSG = defineMessage({
  loadingText: {
    id: 'dashboard.Whitelist.loadingText',
    defaultMessage: 'Loading whitelist',
  },
});

interface Props {
  colony: Colony;
}

const Whitelist = ({ colony: { colonyAddress }, colony }: Props) => {
  const { data: usersData, loading: usersLoading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
    pollInterval: 1000,
  });

  const {
    data: whitelistPolicies,
    loading: loadingWhitelistPolicies,
  } = useWhitelistPoliciesQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const { policyType, agreementHash = '' } =
    whitelistPolicies?.whitelistPolicies || {};

  if (loadingWhitelistPolicies) {
    return (
      <div className={styles.loaderContainer}>
        <SpinnerLoader appearance={{ size: 'huge', theme: 'primary' }} />
      </div>
    );
  }

  return (
    <div>
      {(policyType === WhitelistPolicy.KycOnly ||
        policyType === WhitelistPolicy.KycAndAgreement) && (
        <UploadAddressesWidget
          colony={colony}
          whitelistAgreementHash={
            whitelistPolicies?.whitelistPolicies?.agreementHash
          }
        />
      )}
      {(policyType === WhitelistPolicy.AgreementOnly ||
        policyType === WhitelistPolicy.KycAndAgreement) && (
        <AgreementEmbed agreementHash={agreementHash} />
      )}
      {usersLoading ? (
        <MiniSpinnerLoader loadingText={MSG.loadingText} />
      ) : (
        <WhitelistAddresses
          colony={colony}
          users={usersData?.whitelistedUsers || []}
        />
      )}
    </div>
  );
};

export default Whitelist;
