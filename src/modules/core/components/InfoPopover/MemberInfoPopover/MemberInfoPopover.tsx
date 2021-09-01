import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import {
  AnyUser,
  useUserReputationQuery,
  useColonyNativeTokenQuery,
  useTokenInfoLazyQuery,
  Colony,
} from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '../../../../transformers';
import UserInfo from '../UserInfo';
import UserPermissions from './UserPermissions';

import styles from './MemberInfoPopover.css';

interface Props {
  colony: Colony;
  domainId?: number;
  user?: AnyUser;
}

const MSG = defineMessages({
  headingReputation: {
    id: 'InfoPopover.MemberInfoPopover.headingReputation',
    defaultMessage: 'Reputation',
  },
  descriptionReputation: {
    id: 'InfoPopover.MemberInfoPopover.descriptionReputation',
    defaultMessage: 'earned for tasks paid in native tokens',
  },
  errorReputation: {
    id: 'InfoPopover.MemberInfoPopover.errorReputation',
    defaultMessage: 'We had a problem loading the data',
  },
});

const displayName = 'InfoPopover.MemberInfoPopover';

const MemberInfoPopover = ({
  colony: { colonyAddress },
  colony,
  domainId,
  user = { id: '', profile: { walletAddress: '' } },
}: Props) => {
  const {
    profile: { walletAddress },
  } = user;

  const {
    data: nativeTokenAddressData,
    loading: loadingNativeTokenAddress,
  } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });

  const [
    fetchTokenInfo,
    { data: tokenInfoData, loading: loadingTokenInfoData },
  ] = useTokenInfoLazyQuery();

  const {
    data: userReputationData,
    loading: loadingUserReputation,
    error: errorReputation,
  } = useUserReputationQuery({
    variables: { address: walletAddress, colonyAddress, domainId },
  });

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  useEffect(() => {
    if (nativeTokenAddressData) {
      const {
        processedColony: { nativeTokenAddress },
      } = nativeTokenAddressData;
      fetchTokenInfo({ variables: { address: nativeTokenAddress } });
    }
  }, [fetchTokenInfo, nativeTokenAddressData]);

  if (loadingNativeTokenAddress || loadingUserReputation) {
    return (
      <div className={`${styles.main} ${styles.loadingSpinnerContainer}`}>
        <SpinnerLoader
          appearance={{
            theme: 'primary',
            size: 'medium',
            layout: 'horizontal',
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {user?.profile?.walletAddress && (
        <div className={styles.section}>
          <UserInfo user={user} />
        </div>
      )}
      <div className={styles.section}>
        <div className={styles.reputation}>
          <div className={styles.reputationHeading}>
            <Heading
              appearance={{
                margin: 'none',
                size: 'normal',
                theme: 'grey',
                weight: 'bold',
              }}
              text={MSG.headingReputation}
            />
          </div>
          {userReputationData && tokenInfoData && (
            <Numeral
              appearance={{ theme: 'blue', weight: 'medium' }}
              value={userReputationData.userReputation}
              unit={tokenInfoData.tokenInfo.decimals}
            />
          )}
        </div>
        {(loadingUserReputation ||
          loadingNativeTokenAddress ||
          loadingTokenInfoData) && <SpinnerLoader />}
        {userReputationData && tokenInfoData && (
          <>
            <FormattedMessage tagName="b" {...MSG.descriptionReputation} />
          </>
        )}
        {errorReputation && (
          <p className={styles.reputationError}>
            <FormattedMessage {...MSG.errorReputation} />
          </p>
        )}
      </div>
      {!isEmpty(allUserRoles) && (
        <div className={styles.section}>
          <UserPermissions roles={allUserRoles} />
        </div>
      )}
    </div>
  );
};

MemberInfoPopover.displayName = displayName;

export default MemberInfoPopover;
