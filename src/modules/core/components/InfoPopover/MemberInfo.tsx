import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Badge from '~core/Badge';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import {
  AnyUser,
  useUserBadgesQuery,
  useUserReputationQuery,
  useColonyNativeTokenQuery,
  useTokenInfoLazyQuery,
} from '~data/index';
import { Address } from '~types/index';

import UserInfo from './UserInfo';

import styles from './InfoPopover.css';

interface Props {
  colonyAddress: Address;
  domainId?: number;
  user?: AnyUser;
}

const MSG = defineMessages({
  achievementsHeading: {
    id: 'InfoPopover.MemberInfoPopover.MemberInfo.achievementsHeading',
    defaultMessage: 'Achievements',
  },
  achievementTitleText: {
    id: 'InfoPopover.MemberInfoPopover.MemberInfo.achievementTitleText',
    defaultMessage: '{title} achievement earned in {programTitle}',
  },
  headingReputation: {
    id: 'InfoPopover.MemberInfoPopover.MemberInfo.headingReputation',
    defaultMessage: 'Reputation',
  },
  descriptionReputation: {
    id: 'InfoPopover.MemberInfoPopover.MemberInfo.descriptionReputation',
    defaultMessage: 'earned for tasks paid in native tokens',
  },
  errorReputation: {
    id: 'InfoPopover.MemberInfoPopover.MemberInfo.errorReputation',
    defaultMessage: 'We had a problem loading the data',
  },
});

const displayName = 'InfoPopover.MemberInfoPopover.MemberInfo';

const MemberInfo = ({
  colonyAddress,
  domainId,
  user = { id: '', profile: { walletAddress: '' } },
}: Props) => {
  const { formatMessage } = useIntl();
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

  const { data } = useUserBadgesQuery({
    variables: { address: walletAddress, colonyAddress },
  });

  useEffect(() => {
    if (nativeTokenAddressData) {
      const {
        colony: { nativeTokenAddress },
      } = nativeTokenAddressData;
      fetchTokenInfo({ variables: { address: nativeTokenAddress } });
    }
  }, [fetchTokenInfo, nativeTokenAddressData]);

  const completedLevels = data ? data.user.completedLevels : [];

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
              appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
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
          <FormattedMessage tagName="i" {...MSG.errorReputation} />
        )}
      </div>
      {completedLevels.length > 0 && (
        <div className={styles.section}>
          <Heading
            appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
            text={MSG.achievementsHeading}
          />
          <div className={styles.badges}>
            {completedLevels.map(
              ({ achievement, id, title, program: { title: programTitle } }) =>
                achievement &&
                title && (
                  <Badge
                    key={id}
                    size="xs"
                    name={achievement}
                    title={formatMessage(MSG.achievementTitleText, {
                      title,
                      programTitle,
                    })}
                  />
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

MemberInfo.displayName = displayName;

export default MemberInfo;
