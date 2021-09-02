import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { bigNumberify } from 'ethers/utils';

import { SpinnerLoader } from '~core/Preloaders';
import {
  AnyUser,
  useUserReputationQuery,
  useColonyNativeTokenQuery,
  useTokenInfoLazyQuery,
  Colony,
  useUserBalanceWithLockQuery,
} from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '../../../../transformers';
import UserInfo from '../UserInfo';

import UserPermissions from './UserPermissions';
import UserTokens from './UserTokens';
import UserReputation from './UserReputation';

import styles from './MemberInfoPopover.css';


interface Props {
  colony: Colony;
  domainId?: number;
  user?: AnyUser;
}

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
  const {
    data: userBalanceData,
    loading: loadingUserBalance,
  } = useUserBalanceWithLockQuery({
    variables: {
      address: walletAddress,
      tokenAddress:
        nativeTokenAddressData?.processedColony.nativeTokenAddress || '',
      colonyAddress,
    },
    /* 
      The fetchPolicy here is "no-cache" because otherwise the result would be stored 
      in the cache and then the current user's balance would change (in the other instances 
      where the current user balance is obtained using this query) to the one that it's being 
      displayed in the popover.

      It could also happen in reverse, the current user's balance could show up here instead
      of the balance of a "second person" user.

      Basically, all sorts of shenanigans happen when this result is stored on the cache.
    */
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (nativeTokenAddressData) {
      const {
        processedColony: { nativeTokenAddress },
      } = nativeTokenAddressData;
      fetchTokenInfo({ variables: { address: nativeTokenAddress } });
    }
  }, [fetchTokenInfo, nativeTokenAddressData]);

  if (
    loadingNativeTokenAddress ||
    loadingUserReputation ||
    loadingUserBalance
  ) {
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
  const nativeToken = userBalanceData?.user.userLock.nativeToken;
  const userLock = userBalanceData?.user.userLock;
  const inactiveBalance = bigNumberify(userLock?.nativeToken?.balance || 0);
  const lockedBalance = bigNumberify(userLock?.totalObligation || 0);
  const activeBalance = bigNumberify(userLock?.activeTokens || 0);

  const totalBalance = inactiveBalance.add(activeBalance).add(lockedBalance);

  return (
    <div className={styles.main}>
      {user?.profile?.walletAddress && (
        <div className={styles.section}>
          <UserInfo user={user} />
        </div>
      )}
      <div className={styles.section}>
        <UserReputation
          walletAddress={walletAddress}
          colonyAddress={colonyAddress}
        />
      </div>
      {!totalBalance.isZero() && nativeToken && (
        <div className={styles.section}>
          <UserTokens totalBalance={totalBalance} nativeToken={nativeToken} />
        </div>
      )}
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
