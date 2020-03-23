import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Badge from '~core/Badge';
import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import UserMention from '~core/UserMention';
import {
  AnyUser,
  useUserBadgesQuery,
  useUserReputationLazyQuery,
} from '~data/index';
import { Address } from '~types/index';

import styles from './InfoPopover.css';

interface StandardProps {
  colonyAddress?: undefined;
  skillId?: undefined;
  user: AnyUser;
}

interface PropsWithReputation {
  colonyAddress: Address;
  skillId?: number;
  user: AnyUser;
}

type Props = StandardProps | PropsWithReputation;

const MSG = defineMessages({
  achievementsHeading: {
    id: 'InfoPopover.UserInfoPopover.achievementsHeading',
    defaultMessage: 'Achievements',
  },
  achievementTitleText: {
    id: 'InfoPopover.UserInfoPopover.achievementTitleText',
    defaultMessage: '{title} achievement earned in {programTitle}',
  },
  headingReputation: {
    id: 'InfoPopover.UserInfoPopover.headingReputation',
    defaultMessage: 'Reputation',
  },
  descriptionReputation: {
    id: 'InfoPopover.UserInfoPopover.descriptionReputation',
    defaultMessage: 'earned for tasks paid in native tokens',
  },
  errorReputation: {
    id: 'InfoPopover.UserInfoPopover.errorReputation',
    defaultMessage: 'We had a problem loading the data',
  },
});

const displayName = 'InfoPopover.UserInfoPopover';

const UserInfoPopover = ({ colonyAddress, skillId, user }: Props) => {
  const { formatMessage } = useIntl();
  const {
    displayName: userDisplayName,
    username,
    walletAddress,
  } = user.profile;

  const [
    fetchUserReputation,
    {
      data: userReputationData,
      loading: loadingUserReputation,
      error: errorReputation,
    },
  ] = useUserReputationLazyQuery();

  useEffect(() => {
    if (colonyAddress) {
      fetchUserReputation({
        variables: { address: walletAddress, colonyAddress, skillId },
      });
    }
  }, [colonyAddress, fetchUserReputation, skillId, walletAddress]);

  const { data } = useUserBadgesQuery({
    variables: { address: walletAddress },
  });

  const completedLevels = data ? data.user.completedLevels : [];

  return (
    <div className={styles.main}>
      <div className={styles.section}>
        {userDisplayName && (
          <Heading
            appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
            text={userDisplayName}
          />
        )}
        {username && (
          <p className={styles.userName}>
            <UserMention username={username} hasLink />
          </p>
        )}
        <div className={styles.address}>
          <CopyableAddress full>{walletAddress}</CopyableAddress>
        </div>
      </div>
      {colonyAddress && (
        <div className={styles.section}>
          <div className={styles.reputation}>
            <div className={styles.reputationHeading}>
              <Heading
                appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
                text={MSG.headingReputation}
              />
            </div>
            {userReputationData && (
              <Numeral
                appearance={{ theme: 'blue', weight: 'medium' }}
                value={userReputationData.userReputation}
              />
            )}
          </div>
          {loadingUserReputation && <SpinnerLoader />}
          {userReputationData && (
            <>
              <FormattedMessage tagName="b" {...MSG.descriptionReputation} />
            </>
          )}
          {errorReputation && (
            <FormattedMessage tagName="i" {...MSG.errorReputation} />
          )}
        </div>
      )}
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

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
