import React from 'react';
import { defineMessage } from 'react-intl';

import {
  useWhitelistedUsersQuery,
  useHasKycPolicyQuery,
  useWhitelistAgreementHashQuery,
  Colony,
} from '~data/index';
import { MiniSpinnerLoader, SpinnerLoader } from '~core/Preloaders';

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
  });

  const {
    data: agreementHashData,
    loading: agreementHashLoading,
  } = useWhitelistAgreementHashQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  const {
    data: kycPolicyData,
    loading: kycPolicyLoading,
  } = useHasKycPolicyQuery({
    variables: { colonyAddress },
    fetchPolicy: 'network-only',
  });

  if (kycPolicyLoading || agreementHashLoading) {
    return (
      <div className={styles.loaderContainer}>
        <SpinnerLoader appearance={{ size: 'huge', theme: 'primary' }} />
      </div>
    );
  }

  return kycPolicyData?.hasKycPolicy ? (
    <div>
      <UploadAddressesWidget
        colony={colony}
        whitelistAgreementHash={agreementHashData?.whitelistAgreementHash}
      />
      {usersLoading && <MiniSpinnerLoader loadingText={MSG.loadingText} />}
      {(usersData?.whitelistedUsers?.length && !usersLoading && (
        <WhitelistAddresses
          colony={colony}
          users={usersData.whitelistedUsers}
        />
      )) ||
        null}
    </div>
  ) : (
    agreementHashData?.whitelistAgreementHash && (
      <AgreementEmbed
        agreementHash={agreementHashData?.whitelistAgreementHash}
      />
    )
  );
};

export default Whitelist;
